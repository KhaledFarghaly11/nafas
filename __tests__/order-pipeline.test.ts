/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeDB } from '@/api/mock-db';
import {
  createOrder,
  getOrders,
  getOrderDetail,
  getChefOrders,
  updateOrderStatus,
  acceptOrder,
  rejectOrder,
} from '@/api/mock-server';
import { cartStore } from '@/stores/cart-store';
import { sessionStore } from '@/stores/session-store';
import type { CreateOrderInput, OrderStatus } from '@/types';

describe('T023: Order Pipeline - Creation and Chef Visibility', () => {
  beforeAll(async () => {
    await initializeDB();
  });

  beforeEach(() => {
    cartStore.getState().clearCart();
    sessionStore.getState().logout();
  });

  test('order creation flow: customer creates order, chef sees it pending', async () => {
    const customerId = 'customer-01100000001';
    const kitchenId = 'kitchen-1';
    const chefId = 'chef-01000000001';
    const dishId = 'dish-1';

    const input: CreateOrderInput = {
      customerId,
      items: [
        {
          kitchenId,
          items: [{ dishId, quantity: 2 }],
        },
      ],
      deliveryAddress: '123 Test St, Maadi',
      paymentMethod: 'cash',
      deliveryFee: 25,
      schedule: 'asap',
    };

    const createResult = await createOrder(input);
    // Narrow the type to ensure we have the success case
    if (!('order' in createResult)) {
      throw new Error('Expected order creation to succeed');
    }
    const order = createResult.order;

    expect(order.customerId).toBe(customerId);
    expect(order.status).toBe('pending');
    expect(order.subOrders[0].kitchenId).toBe(kitchenId);
    expect(order.subOrders[0].chefId).toBe(chefId);
    expect(order.subOrders[0].status).toBe('pending');

    const customerOrders = await getOrders(customerId);
    expect((customerOrders as any).orders).toContainEqual(
      expect.objectContaining({ id: order.id }),
    );

    const chefOrders = await getChefOrders(chefId);
    expect((chefOrders as any).orders).toContainEqual(
      expect.objectContaining({ id: order.id }),
    );

    const pendingChefOrders = await getChefOrders(chefId, { status: 'pending' });
    expect((pendingChefOrders as any).orders).toContainEqual(
      expect.objectContaining({ id: order.id, status: 'pending' }),
    );
  });

  test('status transitions: pending -> confirmed -> preparing -> cooking -> ready -> on_the_way -> delivered', async () => {
    const customerId = 'customer-01100000001';
    const kitchenId = 'kitchen-2';
    const dishId = 'dish-6';

    const input: CreateOrderInput = {
      customerId,
      items: [{ kitchenId, items: [{ dishId, quantity: 1 }] }],
      deliveryAddress: '456 Demo Ave, Zamalek',
      paymentMethod: 'cash',
      deliveryFee: 25,
      schedule: 'asap',
    };

    const createResult = await createOrder(input);
    const order = createResult.order;
    const subOrderId = order.subOrders[0].kitchenId;

    const transitions: OrderStatus[] = [
      'confirmed',
      'preparing',
      'cooking',
      'ready',
      'on_the_way',
      'delivered',
    ];

    for (const status of transitions) {
      const result = await updateOrderStatus(order.id, subOrderId, status);
      expect('order' in result).toBe(true);
      const updated = await getOrderDetail(order.id);
      const subOrder = updated.order.subOrders.find(
        (so: any) => so.kitchenId === subOrderId,
      );
      expect(subOrder.status).toBe(status);
    }
  }, 30000);

  test('multi-kitchen order: single order with items from multiple kitchens', async () => {
    const customerId = 'customer-01100000002';
    const kitchen1Id = 'kitchen-1';
    const kitchen2Id = 'kitchen-3';
    const dish1Id = 'dish-1';
    const dish2Id = 'dish-11';

    const input: CreateOrderInput = {
      customerId,
      items: [
        { kitchenId: kitchen1Id, items: [{ dishId: dish1Id, quantity: 1 }] },
        { kitchenId: kitchen2Id, items: [{ dishId: dish2Id, quantity: 2 }] },
      ],
      deliveryAddress: '789 Multi St, Heliopolis',
      paymentMethod: 'cash',
      deliveryFee: 25,
      schedule: 'asap',
    };

    const result = await createOrder(input);
    expect('order' in result).toBe(true);
    const order = result.order;

    expect(order.subOrders).toHaveLength(2);
    expect(order.subOrders[0].kitchenId).toBe(kitchen1Id);
    expect(order.subOrders[1].kitchenId).toBe(kitchen2Id);
    expect(order.subOrders[0].chefId).toBeDefined();
    expect(order.subOrders[1].chefId).toBeDefined();
    expect(order.subOrders[0].chefId).not.toBe(order.subOrders[1].chefId);

    const chef1Orders = await getChefOrders(order.subOrders[0].chefId);
    const chef2Orders = await getChefOrders(order.subOrders[1].chefId);

    expect((chef1Orders as any).orders).toContainEqual(
      expect.objectContaining({ id: order.id }),
    );
    expect((chef2Orders as any).orders).toContainEqual(
      expect.objectContaining({ id: order.id }),
    );
  });

  test('chef accept/reject order shortcuts', async () => {
    const customerId = 'customer-01100000003';
    const kitchenId = 'kitchen-4';
    const dishId = 'dish-16';

    const input: CreateOrderInput = {
      customerId,
      items: [{ kitchenId, items: [{ dishId, quantity: 1 }] }],
      deliveryAddress: '101 Accept St, Dokki',
      paymentMethod: 'cash',
      deliveryFee: 25,
      schedule: 'asap',
    };

    const createResult = await createOrder(input);
    const order = (createResult as any).order;
    const subOrderId = order.subOrders[0].kitchenId;

    const acceptResult = await acceptOrder(order.id, subOrderId);
    expect(acceptResult.success).toBe(true);
    const afterAccept = await getOrderDetail(order.id);
    expect((afterAccept as any).order.subOrders[0].status).toBe('confirmed');

    const input2: CreateOrderInput = {
      customerId,
      items: [{ kitchenId, items: [{ dishId, quantity: 1 }] }],
      deliveryAddress: '102 Reject St, Mohandessin',
      paymentMethod: 'cash',
      deliveryFee: 25,
      schedule: 'asap',
    };

    const createResult2 = await createOrder(input2);
    const order2 = (createResult2 as any).order;
    const subOrderId2 = order2.subOrders[0].kitchenId;

    const rejectResult = await rejectOrder(order2.id, subOrderId2);
    expect(rejectResult.success).toBe(true);
    const afterReject = await getOrderDetail(order2.id);
    expect((afterReject as any).order.subOrders[0].status).toBe('cancelled');
  });

  test('invalid status transition is rejected', async () => {
    const customerId = 'customer-01100000001';
    const kitchenId = 'kitchen-5';
    const dishId = 'dish-21';

    const input: CreateOrderInput = {
      customerId,
      items: [{ kitchenId, items: [{ dishId, quantity: 1 }] }],
      deliveryAddress: '200 Invalid St, Nasr City',
      paymentMethod: 'cash',
      deliveryFee: 25,
      schedule: 'asap',
    };

    const result = await createOrder(input);
    const order = (result as any).order;
    const subOrderId = order.subOrders[0].kitchenId;

    const invalidResult = await updateOrderStatus(
      order.id,
      subOrderId,
      'delivered',
    );
    expect(invalidResult.success).toBe(false);
    expect((invalidResult as any).error.code).toBe('INVALID_TRANSITION');
  });
});
