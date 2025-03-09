import { UnitOfWork } from 'unitOfWork/unitOfWork';

export function Transactional() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const unitOfWork: UnitOfWork = this.unitOfWork; // Service'in içindeki UoW'yi al
      if (!unitOfWork) {
        throw new Error('UnitOfWork instance is missing!');
      }

      await unitOfWork.startTransaction();

      try {
        const result = await originalMethod.apply(this, args);
        await unitOfWork.commitTransaction(); // İşlem başarılıysa commit et
        return result;
      } catch (error) {
        await unitOfWork.rollbackTransaction(); // Hata olursa rollback yap
        throw error;
      }
    };

    return descriptor;
  };
}
