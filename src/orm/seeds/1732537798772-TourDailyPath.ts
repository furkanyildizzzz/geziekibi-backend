import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

export class TourPath1732537798772 implements MigrationInterface {
  name = 'TourPath1732537798772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tourPathRepository = getRepository(TourDailyPath);

    const cities = [
      'Adana',
      'Adıyaman',
      'Afyonkarahisar',
      'Ağrı',
      'Aksaray',
      'Amasya',
      'Ankara',
      'Antalya',
      'Ardahan',
      'Artvin',
      'Aydın',
      'Balıkesir',
      'Bartın',
      'Batman',
      'Bayburt',
      'Bilecik',
      'Bingöl',
      'Bitlis',
      'Bolu',
      'Burdur',
      'Bursa',
      'Çanakkale',
      'Çankırı',
      'Çorum',
      'Denizli',
      'Diyarbakır',
      'Düzce',
      'Edirne',
      'Elazığ',
      'Erzincan',
      'Erzurum',
      'Eskişehir',
      'Gaziantep',
      'Giresun',
      'Gümüşhane',
      'Hakkâri',
      'Hatay',
      'Iğdır',
      'Isparta',
      'İstanbul',
      'İzmir',
      'Kahramanmaraş',
      'Karabük',
      'Karaman',
      'Kars',
      'Kastamonu',
      'Kayseri',
      'Kırıkkale',
      'Kırklareli',
      'Kırşehir',
      'Kilis',
      'Kocaeli',
      'Konya',
      'Kütahya',
      'Malatya',
      'Manisa',
      'Mardin',
      'Mersin',
      'Muğla',
      'Muş',
      'Nevşehir',
      'Niğde',
      'Ordu',
      'Osmaniye',
      'Rize',
      'Sakarya',
      'Samsun',
      'Şanlıurfa',
      'Siirt',
      'Sinop',
      'Şırnak',
      'Sivas',
      'Tekirdağ',
      'Tokat',
      'Trabzon',
      'Tunceli',
      'Uşak',
      'Van',
      'Yalova',
      'Yozgat',
      'Zonguldak',
    ];

    for (const city of cities) {
      const exists = await tourPathRepository.findOneBy({ name: city });
      if (!exists) {
        const tourPath = new TourDailyPath();
        tourPath.name = city;
        await tourPathRepository.save(tourPath);
        console.log(`Seeded: ${city}`);
      }
    }

    console.log('All cities have been seeded!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
