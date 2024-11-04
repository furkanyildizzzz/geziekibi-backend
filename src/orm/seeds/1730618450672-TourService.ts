import { Service } from 'orm/entities/service/Service';
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

export class TourService1730618450672 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const serviceRepository = getRepository(Service);

    let service = new Service();
    service.name = 'Lüks turizm aracı ile ulaşım';
    await serviceRepository.save(service);

    service = new Service();
    service.name = '1 gece konaklama';
    await serviceRepository.save(service);

    service = new Service();
    service.name = 'Rehberlik hizmetleri';
    await serviceRepository.save(service);

    service = new Service();
    service.name = 'Otelde sabah kahvaltısı';
    await serviceRepository.save(service);

    service = new Service();
    service.name = 'Otelde akşam yemeği';
    await serviceRepository.save(service);

    service = new Service();
    service.name = 'Zorunlu seyahat sigortası';
    await serviceRepository.save(service);

    service = new Service();
    service.name = 'Müze ören yeri girişleri';
    await serviceRepository.save(service);

    service = new Service();
    service.name = 'Yemeklerde alınan içecekler';
    await serviceRepository.save(service);

    service = new Service();
    service.name = 'İlk varıştaki sabah kahvaltısı';
    await serviceRepository.save(service);

    service = new Service();
    service.name = 'Fayton ücretleri';
    await serviceRepository.save(service);

    service = new Service();
    service.name = 'Yedigöller dolmuş ücreti kişi sayısına göre belirlenir.';
    await serviceRepository.save(service);

    service = new Service();
    service.name = 'Yolda ve molalarda alınan yemekler';
    await serviceRepository.save(service);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
