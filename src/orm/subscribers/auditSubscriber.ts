import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { BaseEntity } from 'orm/entities/BaseEntity';

const asyncLocalStorage = new AsyncLocalStorage<number>();

export const setCurrentUser = (userId: number, callback: () => Promise<void>) => {
  return asyncLocalStorage.run(userId, callback);
};

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return BaseEntity;
  }

  beforeInsert(event: InsertEvent<any>) {
    if (event.entity instanceof BaseEntity) {
      const userId = asyncLocalStorage.getStore();
      if (userId) {
        event.entity.insertUserId = userId;
        event.entity.updateUserId = userId;
      }
    }
  }

  // beforeUpdate(event: UpdateEvent<any>) {
  //   console.log('I am here!');
  //   if (event.entity instanceof BaseEntity) {
  //     const userId = asyncLocalStorage.getStore();
  //     if (userId) {
  //       event.entity.updateUserId = userId;
  //     }
  //   }
  // }

  afterUpdate(event: UpdateEvent<any>) {
    console.log('🔥 After Update Triggered!', event.entity);

    if (event.entity instanceof BaseEntity) {
      const userId = asyncLocalStorage.getStore();
      if (userId) {
        event.queryRunner.manager.update(event.metadata.tableName, { id: event.entity.id }, { updateUserId: userId });
      }
    }
  }
}
