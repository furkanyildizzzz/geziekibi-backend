import { DeepPartial, EntityMetadata, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseEntity } from 'orm/entities/BaseEntity';
import { AsyncLocalStorage } from 'async_hooks';
import { IBaseRepository } from 'shared/interfaces/IBaseRepository';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { inject } from 'inversify';
import { INTERFACE_TYPE } from 'core/types';
import { UnitOfWork } from 'unitOfWork/unitOfWork';
import { asyncLocalStorage } from 'orm/subscribers/auditSubscriber';
import { ForbiddenException, InternalServerErrorException, UnauthorizedException } from 'shared/errors/allException';
import { Role } from 'orm/entities/users/types';


export class BaseRepository<T extends BaseEntity> implements IBaseRepository<T> {
    private entity: { new(): T };

    constructor(
        protected readonly unitOfWork: UnitOfWork,
        entity: { new(): T }
    ) {
        this.entity = entity;
    }


    private async getRepository(): Promise<Repository<T>> {
        return this.unitOfWork.getRepository<T>(this.entity);
    }

    /**
     * Kullanıcıya özel filtre uygular. Eğer `disableFilter = true` ise filtre uygulanmaz. Eğer kullanıcı rolü 'ADMINISTRATOR' ise filtre uygulanmaz
     */

    applyUserFilter(queryBuilder: SelectQueryBuilder<T>, applyFilter = true) {
        const user = asyncLocalStorage.getStore();

        if (user && user.role != 'ADMINISTRATOR' && applyFilter) {
            console.log("ı am here")
            queryBuilder.andWhere(`${queryBuilder.alias}.insertUserId = :userId`, { userId: user.id });
        }
        return queryBuilder;
    }


    async getAll(relations = [], applyFilter = true): Promise<T[]> {
        const repo = await this.getRepository();
        const queryBuilder = repo.createQueryBuilder("entity");

        // Kullanıcı filtresini uygula (opsiyonel)
        this.applyUserFilter(queryBuilder, applyFilter);

        // İlişkileri dinamik olarak ekle
        relations.forEach(relation => {
            queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
        });

        return queryBuilder.getMany();
    }



    async getById(id: number, relations = [], applyFilter = true): Promise<T | null> {
        try {
            const repo = await this.getRepository();

            // Önce sadece ana entity'yi çekiyoruz (kritik ilişkiler dahil)
            const queryBuilder = repo.createQueryBuilder("entity")
                .where("entity.id = :id", { id });

            // Ana ilişkileri ekleyelim (derin join yerine sadece temel olanları seçiyoruz)
            relations
                .filter((relation) => !relation.includes(".")) // Derin ilişkileri hariç tut
                .forEach((relation) => {
                    queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
                });

            // Derin ilişkileri ekleyelim (nokta içeren ilişkiler)
            relations
                .filter((relation) => relation.includes("."))
                .forEach((relation) => {
                    const parts = relation.split(".");
                    const parentRelation = parts[0];
                    const deepRelation = parts.slice(1).join(".");

                    queryBuilder.leftJoinAndSelect(`${parentRelation}.${deepRelation}`, deepRelation);
                });

            // Kullanıcı filtrelerini uygulayalım (isteğe bağlı)
            this.applyUserFilter(queryBuilder, applyFilter);

            // Veriyi alalım
            const entity = await queryBuilder.getOne();

            if (!entity) {
                return null;
            }

            return entity;
        } catch (error) {
            console.log({ error });
            throw new InternalServerErrorException(error.message);
        }
    }

    async getByIds(ids: number[], relations = [], applyFilter = true): Promise<T[] | null> {
        try {
            if (!ids.length) return []; // Eğer boşsa direkt boş dizi dön.

            const repo = await this.getRepository();

            // Query builder oluştur
            const queryBuilder = repo.createQueryBuilder("entity")
                .where("entity.id IN (:...ids)", { ids });

            // Ana ilişkileri ekleyelim (derin join yerine sadece temel olanları seçiyoruz)
            relations
                .filter((relation) => !relation.includes(".")) // Derin ilişkileri hariç tut
                .forEach((relation) => {
                    queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
                });

            // Derin ilişkileri ekleyelim (nokta içeren ilişkiler)
            relations
                .filter((relation) => relation.includes("."))
                .forEach((relation) => {
                    const parts = relation.split(".");
                    const parentRelation = parts[0];
                    const deepRelation = parts.slice(1).join(".");

                    queryBuilder.leftJoinAndSelect(`${parentRelation}.${deepRelation}`, deepRelation);
                });

            // Kullanıcı filtrelerini uygulayalım (isteğe bağlı)
            this.applyUserFilter(queryBuilder, applyFilter);

            return queryBuilder.getMany();
        } catch (error) {
            console.log({ error });
            throw new InternalServerErrorException(error.message);
        }
    }

    async create(entity: DeepPartial<T>): Promise<T> {
        const repo = await this.getRepository();
        const newEntity = repo.create(entity);
        await repo.save(newEntity);
        console.log({ newEntity })
        return await this.getById(newEntity.id);
    }

    async update(id: number, entity: QueryDeepPartialEntity<T>): Promise<T | null> {
        const repo = await this.getRepository();
        const user = asyncLocalStorage.getStore();
        if (!user) {
            throw new UnauthorizedException("Unauthorized: User ID not found.");
        }
        // Kullanıcıya ait mi kontrol et, eğer admin değilse
        if (user.role != 'ADMINISTRATOR') {
            const existingEntity = await repo.createQueryBuilder("entity")
                .where("entity.id = :id AND entity.insert_user_id = :userId", { id, userId: user.id })
                .getOne();

            if (!existingEntity) {
                throw new ForbiddenException("Forbidden: You do not have permission to update this record.");
            }
        }
        await repo.update(id, entity);
        return await this.getById(id);
    }

    async save(id: number, entity: T): Promise<T | null> {
        const repo = await this.getRepository();
        const user = asyncLocalStorage.getStore();
        if (!user) {
            throw new UnauthorizedException("Unauthorized: User ID not found.");
        }
        // Kullanıcıya ait mi kontrol et, eğer admin değilse
        if (user.role != 'ADMINISTRATOR') {
            const existingEntity = await repo.createQueryBuilder("entity")
                .where("entity.id = :id AND entity.insert_user_id = :userId", { id, userId: user.id })
                .getOne();

            if (!existingEntity) {
                throw new ForbiddenException("Forbidden: You do not have permission to update this record.");
            }
        }
        await repo.save(entity);
        return await this.getById(id);
    }


    async delete(id: number): Promise<void> {
        const repo = await this.getRepository();
        const user = asyncLocalStorage.getStore();

        if (!user) {
            throw new UnauthorizedException("Unauthorized: User ID not found.");
        }

        // Kullanıcıya ait mi kontrol et, eğer admin değilse
        if (user.role != 'ADMINISTRATOR') {
            const existingEntity = await repo.createQueryBuilder("entity")
                .where("entity.id = :id AND entity.insert_user_id = :userId", { id, userId: user.id })
                .getOne();

            if (!existingEntity) {
                throw new ForbiddenException("Forbidden: You do not have permission to delete this record.");
            }
        }

        await repo.delete(id);
    }

    async deleteMultiple(ids: number[]): Promise<void> {
        const repo = await this.getRepository();
        const user = asyncLocalStorage.getStore();

        if (!user) {
            throw new UnauthorizedException("Unauthorized: User ID not found.");
        }

        // Kullanıcıya ait olmayan kayıtları filtrele, eğer admin değilse
        if (user.role != 'ADMINISTRATOR') {
            const ownedEntities = await repo.createQueryBuilder("entity")
                .where("entity.id IN (:...ids) AND entity.insert_user_id = :userId", { ids, userId: user.id })
                .getMany();

            const ownedIds = ownedEntities.map(e => e.id);

            if (ownedIds.length === 0) {
                throw new ForbiddenException("Forbidden: You do not have permission to delete these records.");
            }
        }

        await repo.delete(ids);
    }


    public async findOneByField<K extends keyof T>(field: K, value: T[K], applyFilter = true): Promise<T | null> {
        const repo = await this.getRepository();
        const queryBuilder = repo.createQueryBuilder("entity")
            .where(`entity.${field as string} = :value`, { value });

        // this.applyUserFilter(queryBuilder, applyFilter); // Opsiyonel olarak filtre uygula
        return queryBuilder.getOne();
    }

    public async findAllByField<K extends keyof T>(field: K, value: T[K], applyFilter = true): Promise<T[] | null> {
        const repo = await this.getRepository();
        const queryBuilder = repo.createQueryBuilder("entity")
            .where(`entity.${field as string} = :value`, { value });

        // this.applyUserFilter(queryBuilder, applyFilter); // Opsiyonel olarak filtre uygula
        return queryBuilder.getMany();
    }

    public async findByIds(ids: number[], applyFilter = true): Promise<T[]> {
        if (!ids.length) return []; // Eğer boşsa direkt boş dizi dön.

        const repo = await this.getRepository();
        const queryBuilder = repo.createQueryBuilder("entity")
            .where("entity.id IN (:...ids)", { ids });

        this.applyUserFilter(queryBuilder, applyFilter); // Opsiyonel olarak filtre uygula

        return queryBuilder.getMany();
    }

}
