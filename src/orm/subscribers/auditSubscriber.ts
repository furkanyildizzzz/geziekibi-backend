import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { BaseEntity } from 'orm/entities/BaseEntity';
import { Role } from 'orm/entities/users/types';

export const asyncLocalStorage = new AsyncLocalStorage<{ id: number, role: Role }>();

export const setCurrentUser = async (user: { id: number, role: Role }, callback:  () => Promise<void>) => {
  asyncLocalStorage.run(user, async () => {
    await callback(); // Burada bağlam kaybolmamalı
  });
  // return asyncLocalStorage.run(user, callback);
};

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return BaseEntity;
  }

  beforeInsert(event: InsertEvent<any>) {
    if (event.entity instanceof BaseEntity) {
      const user = asyncLocalStorage.getStore();
      if (user) {
        event.entity.insertUserId = user.id;
        event.entity.updateUserId = user.id;
      }
    }
  }

  afterUpdate(event: UpdateEvent<any>) {
    console.log('🔥 After Update Triggered!');

    if (event.entity instanceof BaseEntity) {
      const user = asyncLocalStorage.getStore();
      if (user) {
        event.queryRunner.manager.update(event.metadata.tableName, { id: event.entity.id }, { updateUserId: user.id });
      }
    }
  }
}
