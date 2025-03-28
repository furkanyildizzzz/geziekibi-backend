import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { Image } from 'orm/entities/image/Image';
import { Service } from 'orm/entities/service/Service';
import { Tag } from 'orm/entities/tag/Tag';
import { Tour } from 'orm/entities/tour/Tour';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { TourDaily } from 'orm/entities/tour/TourDaily';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { TourDailyVisitingPlace } from 'orm/entities/tour/TourDailyVisitingPlace';
import { TourDate } from 'orm/entities/tour/TourDate';
import { TourService } from 'orm/entities/tour/TourService';
import { PublishStatus, ServiceType, TourType } from 'shared/utils/enum';
import { generateUniqueSeoLink } from 'shared/utils/generateSeoLink';
import { DataSource } from 'typeorm';

const seedTours = async (dataSource: DataSource) => {
  await DoguKaradenizTuru(dataSource);
  await BatıKaradenizTuru(dataSource);
  await UrfaTuru(dataSource);
  await KapadokyaTuru(dataSource);
  await KuzeyEgeTuru(dataSource);
  await GuneyDoguTuru(dataSource);
  await AnkaraEskisehirTuru(dataSource);
  await OrtaAvrupaBalkanTuru(dataSource);
  console.log('All tours have been seeded!');
};

const DoguKaradenizTuru = async (dataSource: DataSource) => {
  const TourRepository = dataSource.getRepository(Tour);

  const today = new Date();

  const tour = new Tour();

  tour.title = 'Doğu Karadeniz Turu';
  tour.spot = "Doğu Karadeniz Rüyası, Karadeniz'in Tüm Yeşilini Yaşamak İsteyenlere ...";
  tour.body = '';
  tour.tourType = TourType.YURTICI;
  tour.publishStatus = PublishStatus.PUBLISH;
  tour.publishDate = new Date(today.getDate() - 2);
  tour.startDate = new Date('2024-10-10');
  tour.endDate = new Date('2024-10-14');
  tour.seoLink = await generateUniqueSeoLink(tour.title, 'tour');
  tour.insertUserId = 1;

  tour.category = { id: 4 } as TourCategory;
  tour.tags = [{ id: 1 } as Tag, { id: 2 } as Tag, { id: 4 } as Tag, { id: 5 } as Tag];

  tour.tourDates = [
    {
      insertUserId: 1,
      startDate: '2024-12-10',
      endDate: '2024-12-14',
      description: 'Guided tour of the city',
      isActive: true,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2024-12-15'),
      endDate: new Date('2024-12-19'),
      description: 'Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
  ] as TourDate[];

  tour.dailyForms = [
    {
      insertUserId: 1,
      name: '1.Gün',
      description: 'Saat 19:00 da Geziekibi Turizm Seyahat Acentası önünden hareket.',
      dailyPaths: [
        { id: 42, insertUserId: 1 } as TourDailyPath, //Kahramanmaraş
        { id: 72, insertUserId: 1 } as TourDailyPath, // Sivas
        { id: 74, insertUserId: 1 } as TourDailyPath, // Tokat
        { id: 6, insertUserId: 1 } as TourDailyPath, // Amasya
      ],
      dailyVisitingPlaces: [],
      breakfeast: '',
      lunch: '',
      dinner: '',
    },
    {
      insertUserId: 1,
      name: '2.Gün',
      description:
        'Sabah kahvaltısından (ekstra ) sonra, profesyonel rehberimiz ile buluşma.  Ferhat’ın, Şirin için Yaptığı su bentleri, gezilip Kral kaya mezarları , Amasya evleri , minyatür müze , Samsun’a hareket ediliyor. Samsun’da Bandırma Vapuru  ziyaret edilip Orduya geçiyoruz Ordu Boztepeye  teleferik  ile çıkarak muhteşem manzaryla çay kahve molası veriyoruz ardından tekrar teleferikle inerek aracımıza biniyoruz Akşam yemeği ve konaklama için otelimize geçiyoruz',
      dailyPaths: [
        { id: 6, insertUserId: 1 } as TourDailyPath, //Amasya
        { id: 67, insertUserId: 1 } as TourDailyPath, // Samsun
        { id: 63, insertUserId: 1 } as TourDailyPath, // Ordu
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Ferhat’ın, Şirin için Yaptığı su bentleri' },
        { insertUserId: 1, name: 'Kral kaya mezarları' },
        { insertUserId: 1, name: 'Amasya evleri' },
        { insertUserId: 1, name: 'Minyatür müze' },
        { insertUserId: 1, name: 'Bandırma Vapuru' },
        { insertUserId: 1, name: 'Boztepe' },
      ],
      breakfeast: 'Ekstra',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '3.Gün',
      description:
        'Kahvaltının ardından otelden ayrılıyoruz. Ordu Çotonak fabrikasına geçerek  fındık alışverişini yapıp Giresun üzerinden Trabzon’a doğru yola çıkıyoruz. Atatürk köşkü  , Ayasofya camisini  ve öğlen yemeği(ekstra), daha sonra , çay fabrikası uğrayarak çayın yapılışı ile ilgili bilgi aldıktan çay bahçesi ve sonrasında akşam yemeği konaklama. Uzungöl Sezgin Butik otel',
      dailyPaths: [
        { id: 63, insertUserId: 1 } as TourDailyPath, //Ordu
        { id: 34, insertUserId: 1 } as TourDailyPath, // Giresun
        { id: 75, insertUserId: 1 } as TourDailyPath, // Trabzon
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Fındık Fabrikası' },
        { insertUserId: 1, name: 'Atatürk Köşkü' },
        { insertUserId: 1, name: 'Ayasofya Camisi' },
        { insertUserId: 1, name: 'Çay Fabrikası' },
      ],
      breakfeast: 'Otel',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '4.Gün',
      description:
        'Otelde alacağımız kahvaltı ardından Karadeniz’in simgesi olan Uzungöl’e Kaçkar eteklerinde bulunan Karaster yaylasına dolmuşlarla çıkıyoruz   Soğanlı dağlarındaki tabiat parkını geziyoruz. Burayı gezdikten sonra Rize’ye geçerek Rize bezi üretimini görüyoruz.  Fırtına vadisi yemek molası sonrası dileyenler Rafting , zipline  etkinlerini yapabilirler daha sonra Ayder Butik otel Serender Otel',
      dailyPaths: [
        { id: 75, insertUserId: 1 } as TourDailyPath, //Uzungöl
        { insertUserId: 1, name: 'Sürmene' } as TourDailyPath, // Sürmene
        { id: 65, insertUserId: 1 } as TourDailyPath, // Rize
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Uzungöl’' },
        { insertUserId: 1, name: 'Karaster yaylası' },
        { insertUserId: 1, name: 'Soğanlı dağları' },
        { insertUserId: 1, name: 'Rize bezi üretimi' },
        { insertUserId: 1, name: 'Fırtına vadisi' },
      ],
      breakfeast: 'Otel',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '5.Gün',
      description:
        'Otelde alacağımız kahvaltı sonrası Çamlıhemşine geçiyoruz  dolmuşlara binerek  ,  çat vadisi, Zilkale, şenyuva köyü gezileri sonrası tekrar aracımıza binerek  öğlen yemeği (ekstra) molamızı veriyoruz ardından Sürmeneye geçerek Bıcak atölyesinde Meşhur sürmene bıçağını tanıtımı için serbest zaman veriyoruz t serbest zaman sonrası  Zigana Hamsiköy de sütlaç ve Akşam yemeği sonrası Hatay’a dönüş. ',
      dailyPaths: [
        { id: 75, insertUserId: 1 } as TourDailyPath, //Trabzon
        { insertUserId: 1, name: 'Çamlıhemşin' } as TourDailyPath, // Sürmene
        { id: 37, insertUserId: 1 } as TourDailyPath, // Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Çamlıhemşin' },
        { insertUserId: 1, name: 'Çat Vadisi' },
        { insertUserId: 1, name: 'Zilkale' },
        { insertUserId: 1, name: 'Şenyuva Köyü' },
        { insertUserId: 1, name: 'Sürmene' },
        { insertUserId: 1, name: 'Zigana Hamsiköy' },
      ],
      breakfeast: 'Otel',
      lunch: 'Ekstra',
      dinner: 'Zigana Hamsiköy',
    },
  ] as TourDaily[];

  tour.tourServices = [
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 1,
        description: '(sayıya göre araç çıkartılacaktır.)',
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 6,
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 9,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 23,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 21,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 8,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 22,
      },
    },
  ] as TourService[];

  tour.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733308046/dev/tour/2024-12-04/1/w7hlcp0yi6ygvapsqxlo.jpg',
      format: 'jpg',
      width: 806,
      height: 646,
      publicId: 'dev/tour/2024-12-04/1/w7hlcp0yi6ygvapsqxlo',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733308046/dev/tour/2024-12-04/1/w7hlcp0yi6ygvapsqxlo.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T07:27:26.000Z'),
      originalName: 'karadeniz-turu-806-646.jpg',
      insertUserId: 1,
    } as Image,
  ];

  await TourRepository.save(tour);
};

const BatıKaradenizTuru = async (dataSource: DataSource) => {
  const TourRepository = dataSource.getRepository(Tour);

  const today = new Date();

  const tour = new Tour();

  tour.title = 'Batı Karadeniz Turu';
  tour.spot = 'Batı Karadeniz Turu';
  tour.body = '';
  tour.tourType = TourType.YURTICI;
  tour.publishStatus = PublishStatus.PUBLISH;
  tour.publishDate = new Date(today.getDate() - 20);
  tour.startDate = new Date('2024-10-10');
  tour.endDate = new Date('2024-10-13');
  tour.seoLink = await generateUniqueSeoLink(tour.title, 'tour');
  tour.insertUserId = 1;

  tour.category = { id: 3 } as TourCategory;
  tour.tags = [{ id: 1 } as Tag, { id: 2 } as Tag, { id: 4 } as Tag, { id: 5 } as Tag];

  tour.tourDates = [
    {
      insertUserId: 1,
      startDate: '2024-10-10',
      endDate: '2024-10-13',
      description: 'Guided tour of the city',
      isActive: true,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2024-11-10'),
      endDate: new Date('2024-11-13'),
      description: 'Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2024-12-10'),
      endDate: new Date('2024-12-13'),
      description: 'Very Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: '(2-3 Kişilik Oda da Kişi Başı)',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (6-9 yaş)',
          price: 7500,
          currency: 'try',
          description: '(İki yetiskin yaninda kalinacaksa)',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (3-6 yaş)',
          price: 7500,
          currency: 'try',
          description: '(İki yetiskin yaninda kalinacaksa)',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
  ] as TourDate[];

  tour.dailyForms = [
    {
      insertUserId: 1,
      name: '1.Gün',
      description: '19:00 saatlerinde  buluşma ve hareket, sabah saatlerinde Boluya varış',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
        { id: 19, insertUserId: 1 } as TourDailyPath, // Bolu
      ],
      dailyVisitingPlaces: [],
      breakfeast: '',
      lunch: '',
      dinner: '',
    },
    {
      insertUserId: 1,
      name: '2.Gün',
      description:
        'İlk durağımız Boylu Soylu otelde açık büfe sabah kahvaltısı için (Ekstra ) kahvaltımızı aldıktan sonra Minibüslerle (ekstra  dolmuş ve milli park giriş ücreti)  bir saatlik mesafede Denizden yüksekliği 1350m olan Köknar ve Kayın ağaçlarıyla çevrili görülmeye değer manzarası ve huzur dolu doğayı için de barındıran Yedigöllere hareket ediyoruz burada hem yürüyüş yapıyor hemde fotoğraflar çekiyoruz  daha sonra toplanma ve aynı dolmuşlarla aşağı iniyoruz. Otobüsümüze binerek öğle yemeği (Barbekü +içecek ekstra ) için Gölcük Milli Parkına geçiyoruz. Akabinde Gölcük Milli Parkı  gezimiz ve serbest zaman  sonrası Safranbolu’ya hareket ediyoruz Konaklama ve akşam yemeği için otelimize geçiyouz',
      dailyPaths: [
        { id: 19, insertUserId: 1 } as TourDailyPath, //Bolu
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Yedigöller' },
        { insertUserId: 1, name: 'Gölcük Milli Parkı' },
        { insertUserId: 1, name: 'Safranbolu' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: 'Barbekü + İçecek (Ekstra)',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '3.Gün',
      description:
        'Sabah Kahvaltısı otelimizde aldıktan sonra ilk durağımız yöresel ürünler  alışverişi için serbest Safranbolu’da zaman veriyoruz ardından toplanma ve Hıdırlık Tepesine hareket ediyoruz burada fotoğraf molası veriyoruz ve ardından Safranbolu tanıtım sinevizyonu ve dünyaca ünlü yöresel lokum tanıtımı ve Safran bitkisinin tanıtımı yapıyoruz ardından alışveriş için serbest zaman vererek Kaymakamlar konağına giderek Konakların mimarisini yakından tanıyoruz ve ardında serbest zaman veriyoruz ve tekrar buluşma ve Cam Teras ve Ters evi göreceğimiz daha sonra Amasra’ya hareket ediyoruz yollarda çınar ağaçlarıyla kaplı Bitki Tünelinde fotoğraflar çekerek ve huzur dolu manzarayı izleyerek Amasra’ya varıyoruz Fatih Sultan Mehmet’in “Lala ,Lala Çeşm-i Cihan dedikleri bu mu ola(Dünya’nın göz bebeği)”sözleri ile ün kazanan güzel Amasra’yı gezmeye başlıyoruz öğle yemeği molası (ekstra ) sonrası öncelikle Amasra’nın  dıştan göreceğimiz muhteşem manzarasını görmek için 45 dakikalık Tekne turumuza katılıyoruz(ekstra)daha sonra Cenevizliler döneminden kalma Amasra Kalesi, Bizans döneminden kalma kale surları ve manzaraya karşı fotoğraflarımızı çektikten sonra tekrar toplanma ve dönüş yolculuğu için aracımıza biniyoruz Pazartesi Sabaha doğru Hatay’a  varış...',
      dailyPaths: [
        { id: 19, insertUserId: 1 } as TourDailyPath, //Bolu
        { id: 13, insertUserId: 1 } as TourDailyPath, //Bartın - Amasra
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Safranbolu' },
        { insertUserId: 1, name: 'Hıdırlık Tepesi' },
        { insertUserId: 1, name: 'Kaymakamlar Konağı' },
        { insertUserId: 1, name: 'Cam Teras' },
        { insertUserId: 1, name: 'Ters Ev' },
        { insertUserId: 1, name: 'Bitki Tüneli' },
        { insertUserId: 1, name: 'Amasra Kalesi' },
        { insertUserId: 1, name: 'Kale Surları' },
      ],
      breakfeast: 'Otel',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
  ] as TourDaily[];

  tour.tourServices = [
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 1,
        description: '(sayıya göre araç çıkartılacaktır.)',
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 6,
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 9,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 23,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 21,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 8,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 22,
      },
    },
  ] as TourService[];

  tour.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733308937/dev/tour/2024-12-04/2/n5lhbjlycjor05nwnkb1.png',
      format: 'png',
      width: 806,
      height: 646,
      publicId: 'dev/tour/2024-12-04/2/n5lhbjlycjor05nwnkb1',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733308937/dev/tour/2024-12-04/2/n5lhbjlycjor05nwnkb1.png',
      order: 1,
      createdAt: new Date('2024-12-04T07:42:17.000Z'),
      originalName: 'bati-karadeniz-turu-806-646.png',
      insertUserId: 1,
    } as Image,
  ];
  await TourRepository.save(tour);
};

const UrfaTuru = async (dataSource: DataSource) => {
  const TourRepository = dataSource.getRepository(Tour);

  const today = new Date();

  const tour = new Tour();

  tour.title = 'Nemrut, Halfeti, Harran / Urfa Turu';
  tour.spot = 'Nemrut, Halfeti, Harran / Urfa Turu';
  tour.body = '';
  tour.tourType = TourType.YURTICI;
  tour.publishStatus = PublishStatus.PUBLISH;
  tour.publishDate = new Date(today.getDate() - 10);
  tour.startDate = new Date('2024-10-10');
  tour.endDate = new Date('2024-10-12');
  tour.seoLink = await generateUniqueSeoLink(tour.title, 'tour');
  tour.insertUserId = 1;

  tour.category = { id: 8 } as TourCategory;
  tour.tags = [
    { id: 31 } as Tag,
    { id: 20 } as Tag,
    { id: 16 } as Tag,
    { id: 10 } as Tag,
    { id: 50 } as Tag,
    { id: 51 } as Tag,
    { id: 52 } as Tag,
  ];

  tour.tourDates = [
    {
      insertUserId: 1,
      startDate: '2024-10-15',
      endDate: '2024-10-17',
      description: 'Guided tour of the city',
      isActive: true,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2024-11-15'),
      endDate: new Date('2024-11-17'),
      description: 'Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2024-12-15'),
      endDate: new Date('2024-12-17'),
      description: 'Very Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: '(2-3 Kişilik Oda da Kişi Başı)',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (6-9 yaş)',
          price: 7500,
          currency: 'try',
          description: '(İki yetiskin yaninda kalinacaksa)',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (3-6 yaş)',
          price: 7500,
          currency: 'try',
          description: '(İki yetiskin yaninda kalinacaksa)',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
  ] as TourDate[];

  tour.dailyForms = [
    {
      insertUserId: 1,
      name: '1.Gün',
      description:
        'Hatay’dan akşam saat 19.00 da daha önce belirlediğimiz noktalaradan siz değerli misafirlerimizi alarak Adıyaman’a hareket ediyoruz Kahta ya geçiş ve Nemrut’a çıkarak güneşin doğuşunu doğu- batı teraslarını ziyaretinden sonra cendere köprüsü, karakuş tepesi ve arsemia dan sonra karadut’a kahvaltıya geçiyoruz. Ardından Atatürk Barajına geçiyoruz. Baraj ziyaretinden sonra Şanlıurfa’ya hareket ediyor ve öğlen yemeğine geçiyoruz. Yemek sonrası Şanlıurfa şehir merkezinde İbrahim Peygamberin Doğduğu Mağara, ateşe atıldığı yer, Balıklı göl, Halil-ül Rahman Gölü, Ayn-El Zeliha Gölü, Mevlid-İ Halil Camii, Rızvaniye Camii, Kapalıçarşı, Şurkav Kültür Merkezi, Kilimciler, İsotçular, Demirciler, Bakırcılar Çarşıları ve Gümrük Han’ı geziyoruz. Gümrük Han’da acentamızın ikramı olan çay ve mırra içip otele yerleşip dinlendikten sonra sıra gecesinin yapılacağı tarihi konağa geçip sıra gecesine katıldıktan sora otelde dinlenmeye çekiliyoruz.',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
        { id: 2, insertUserId: 1 } as TourDailyPath, // Adıyaman
        { id: 68, insertUserId: 1 } as TourDailyPath, // Şanlıurfa
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Kahta' },
        { insertUserId: 1, name: 'Nemrut' },
        { insertUserId: 1, name: 'Cendere Tepesi' },
        { insertUserId: 1, name: 'Karakuş Tepesi' },
        { insertUserId: 1, name: 'Arsemia' },
        { insertUserId: 1, name: 'Karadut' },
        { insertUserId: 1, name: 'Atatürk Barajı' },
        { insertUserId: 1, name: 'İbrahim Peygamberin Doğduğu Mağara' },
        { insertUserId: 1, name: 'İbrahim Peygamberin Ateşe Atıldığı Yer' },
        { insertUserId: 1, name: 'Balıklı Göl' },
        { insertUserId: 1, name: 'Halil-ül Rahman Göl' },
        { insertUserId: 1, name: 'Ayn-El Zeliha Göl' },
        { insertUserId: 1, name: 'Mevlid-İ Halil Camii' },
        { insertUserId: 1, name: 'Rızvaniye Camii' },
        { insertUserId: 1, name: 'Kapalıçarşı' },
        { insertUserId: 1, name: 'Şurkav Kültür Merkezi' },
        { insertUserId: 1, name: 'Kilimciler, İsotçular, Demirciler, Bakırcılar Çarşıları' },
        { insertUserId: 1, name: 'Gümrük Han' },
        { insertUserId: 1, name: 'Sıra Gecesi' },
      ] as TourDailyVisitingPlace[],
      breakfeast: 'Acenta',
      lunch: 'Ekstra',
      dinner: 'Sıra Gecesi',
    },
    {
      insertUserId: 1,
      name: '2.Gün',
      description:
        'Otelde açık büfe kahvaltımızı aldıktan sonra dünyanın ilk üniversitesinin de bulunduğu, Dünya’da sadece 3 bölgede bulunan Konik Kubbeli Harran Evleriyle koruma altına alınmış olan Harran’da; Ulucami kalıntıları, Höyük, Şehir Surları, Kale, geleneksel Harran evlerinin en güzellerinden birini gördükten sonra Hz.Eyyüp Peygamberin çile çektiği makama geçiyoruz. Şanlıurfa merkeze gelip oradan Halfeti’ye geçiyoruz.Feribot gezisi kral kayalıkları rum kale ve sular altında kalan Halfeti’yi gezdikten sonra öğlen yemeğinde dubalar üzerinde balık ekmek yiyiyoruz. Birecik’e geçerek koruma altına alınan keleynak üretim merkezini ziyaret ederek Fırat kenarında dinlenme ve çay ikramından sonra Hatay’a hareket ediyoruz.',
      dailyPaths: [
        { id: 68, insertUserId: 1 } as TourDailyPath, // Şanlıurfa
        { id: 16, insertUserId: 1 } as TourDailyPath, //Bilecik
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Konik Kubbeli Harran Evleri' },
        { insertUserId: 1, name: 'Ulucami kalıntıları' },
        { insertUserId: 1, name: 'Höyük' },
        { insertUserId: 1, name: 'Şehir Surları' },
        { insertUserId: 1, name: 'Kale' },
        { insertUserId: 1, name: 'Hz.Eyyüp Peygamberin çile çektiği makam' },
        { insertUserId: 1, name: 'Halfeti' },
        { insertUserId: 1, name: 'keleynak üretim merkezi' },
        { insertUserId: 1, name: 'Fırat Nehri' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: 'Balık + İçecek (Ekstra)',
      dinner: '',
    },
  ] as TourDaily[];

  tour.tourServices = [
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 1,
        description: '(sayıya göre araç çıkartılacaktır.)',
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 6,
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 9,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 23,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 21,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 8,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 22,
      },
    },
  ] as TourService[];

  tour.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733309539/dev/tour/2024-12-04/3/skcc7fgzgwjxfaeoj7zf.jpg',
      format: 'jpg',
      width: 806,
      height: 646,
      publicId: 'dev/tour/2024-12-04/3/skcc7fgzgwjxfaeoj7zf',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733309539/dev/tour/2024-12-04/3/skcc7fgzgwjxfaeoj7zf.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T07:52:19.000Z'),
      originalName: 'nemrut-halfeti-turu-806-646.jpg',
      insertUserId: 1,
    } as Image,
  ];
  await TourRepository.save(tour);
};

const KapadokyaTuru = async (dataSource: DataSource) => {
  const TourRepository = dataSource.getRepository(Tour);

  const today = new Date();

  const tour = new Tour();

  tour.title = 'Kapadokya Turu';
  tour.spot = 'Kapadokya Turu';
  tour.body = '';
  tour.tourType = TourType.YURTICI;
  tour.publishStatus = PublishStatus.PUBLISH;
  tour.publishDate = new Date(today.getDate() - 20);
  tour.startDate = new Date('2024-10-10');
  tour.endDate = new Date('2024-10-13');
  tour.seoLink = await generateUniqueSeoLink(tour.title, 'tour');
  tour.insertUserId = 1;

  tour.category = { id: 13 } as TourCategory;
  tour.tags = [{ id: 1 } as Tag, { id: 2 } as Tag, { id: 4 } as Tag, { id: 5 } as Tag];

  tour.tourDates = [
    {
      insertUserId: 1,
      startDate: '2024-3-10',
      endDate: '2024-3-13',
      description: 'Kapadokya',
      isActive: true,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2024-4-10'),
      endDate: new Date('2024-4-13'),
      description: 'Özel tur',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2024-5-10'),
      endDate: new Date('2024-5-13'),
      description: 'Very Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: '(2-3 Kişilik Oda da Kişi Başı)',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (6-9 yaş)',
          price: 7500,
          currency: 'try',
          description: '(İki yetiskin yaninda kalinacaksa)',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (3-6 yaş)',
          price: 7500,
          currency: 'try',
          description: '(İki yetiskin yaninda kalinacaksa)',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
  ] as TourDate[];

  tour.dailyForms = [
    {
      insertUserId: 1,
      name: '1.Gün',
      description: 'Siz değerli misafirlerimizi belirlenen hareket noktalarından alıp Kapadokya turumuza başlıyoruz.',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
        { id: 61, insertUserId: 1 } as TourDailyPath, // Nevşehir
      ],
      dailyVisitingPlaces: [],
      breakfeast: '',
      lunch: '',
      dinner: '',
    },
    {
      insertUserId: 1,
      name: '2.Gün',
      description:
        'Yollarda vereceğimiz kısa molalarla sabah saatlerinde Kapadokya’ya varıyoruz. Sabah kahvaltısından sonra volkan patlamaları ve hava koşullarının oluşturduğu kaya oluşumlarının ve peri bacalarının bizi karşılamasıyla öncelikle Derinkuyu Yeraltı Şehri’ni geziyoruz. Ordan Ihalara Vadisi  ziyaret ediyoruz. Akabinde akşam yemeği ve konaklama için otelimize yerleşip dinleniyoruz.',
      dailyPaths: [
        { id: 61, insertUserId: 1 } as TourDailyPath, // Nevşehir
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Derinkuyu Yeraltı Şehri' },
        { insertUserId: 1, name: 'Ihalara Vadisi' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '3.Gün',
      description:
        'Sabah kahvaltımızı aldıktan Güvercinlik Vadisi’ne gidiyoruz Burada rehberimiz eşliğinde kayalara oyulmuş Uçhisar Kalesi’ne, kaleyi gördükten sonra bölgede yöresel Sütle kavrulmuş kabak çekirdeği için alış veriş zamanı veriyoruz ardından öncelikle Göremeyi panoramik izleyip kahve molası veriyoruz. Ordan  Açık Hava Müzesi’ne panoramik tur gerçekleştirip bölgedeki çömlekçiye geçiyoruz çömlek hakkında bilgi alarak alış veriş zamanı, akabinde öğlen yemeği molası veriyoruz (testi kebabı menüsü) gidiyoruz. Öğle yemeğinden sonra. Avanos’a hareket edip Kızılırmak üstüne asma köprüden geçerek tekrar aracımıza biniyoruz. Ordan Paşabağında Perpacalarını görerek serbest zaman veriyoruz Daha sonra Ürgüp’te Asmalı Konak ve Ürgüp’ü geziyoruz . son durağımız, üçgüzellei gördükten sonra otobüsümüze binip dönüş yoluna doğru hareket ediyoruz.yollarda vereceğimiz kısa molalarla varıyoruz ve bir dahaki turda buluşmak dileğiyle vedalaşıyoruz.',
      dailyPaths: [
        { id: 61, insertUserId: 1 } as TourDailyPath, // Nevşehir
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Güvercinlik Vadisi' },
        { insertUserId: 1, name: 'Uçhisar Kalesi' },
        { insertUserId: 1, name: 'Göreme' },
        { insertUserId: 1, name: 'Açık Hava Müzesi’' },
        { insertUserId: 1, name: 'Avanos’' },
        { insertUserId: 1, name: 'Paşabağı' },
        { insertUserId: 1, name: 'Asmalı Konak' },
        { insertUserId: 1, name: 'Üç Güzeller' },
      ],
      breakfeast: 'Otel',
      lunch: 'Acenta',
      dinner: '',
    },
  ] as TourDaily[];

  tour.tourServices = [
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 1,
        description: '(sayıya göre araç çıkartılacaktır.)',
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 6,
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 9,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 23,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 21,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 8,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 22,
      },
    },
  ] as TourService[];

  tour.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733310181/dev/tour/2024-12-04/4/jtrycadhi5kumlczzt7z.jpg',
      format: 'jpg',
      width: 806,
      height: 646,
      publicId: 'dev/tour/2024-12-04/4/jtrycadhi5kumlczzt7z',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733310181/dev/tour/2024-12-04/4/jtrycadhi5kumlczzt7z.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T08:03:01.000Z'),
      originalName: 'kapadokya-turu-806-646.jpg',
      insertUserId: 1,
    } as Image,
  ];
  await TourRepository.save(tour);
};

const KuzeyEgeTuru = async (dataSource: DataSource) => {
  const TourRepository = dataSource.getRepository(Tour);

  const today = new Date();

  const tour = new Tour();

  tour.title = 'Kuzey Ege Turu';
  tour.spot = '';
  tour.body = '';
  tour.tourType = TourType.YURTICI;
  tour.publishStatus = PublishStatus.PUBLISH;
  tour.publishDate = new Date(today.getDate() - 2);
  tour.startDate = new Date('2024-10-10');
  tour.endDate = new Date('2024-10-13');
  tour.seoLink = await generateUniqueSeoLink(tour.title, 'tour');
  tour.insertUserId = 1;

  tour.category = { id: 5 } as TourCategory;
  tour.tags = [{ id: 1 } as Tag, { id: 2 } as Tag, { id: 4 } as Tag, { id: 5 } as Tag];

  tour.tourDates = [
    {
      insertUserId: 1,
      startDate: '2024-06-10',
      endDate: '2024-06-13',
      description: 'Guided tour of the city',
      isActive: true,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2024-7-15'),
      endDate: new Date('2024-7-18'),
      description: 'Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2024-08-15'),
      endDate: new Date('2024-08-18'),
      description: 'Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
  ] as TourDate[];

  tour.dailyForms = [
    {
      insertUserId: 1,
      name: '1.Gün',
      description: 'saat 13:00 Hatay Büyük şehir belediyesi önünde buluşma ve turumuza başlıyoruz.',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
        { id: 22, insertUserId: 1 } as TourDailyPath, // Çanakkale
      ],
      dailyVisitingPlaces: [],
      breakfeast: '',
      lunch: '',
      dinner: 'Ekstra',
    },
    {
      insertUserId: 1,
      name: '2.Gün',
      description:
        'Sabah kahvaltısını Gelibolu’da yaptıktan sonra sırasıyla Kilitbahir, Seyit Onbaşı, Şahindere Şehitliği, Morto Koyu, Çanakkale Savaşlarında şehit Düşen 253 000 Şehidimizi simgeleyen abidelerin en görkemlisi olan  Çanakkale Şehitleri Abidesi, Seddülbahir, Yahya Çavuş Şehitliği ve Anıtı gezilerinden sonra Alçıtepe’de öğle yemeğini alıyoruz. (Ekstra) Öğle yemeğinden sonra,   Çanakkale Savaşları sonrasında bulunan silah, Mermi çeşitleri, Giysi ve Savaşla ilgili Fotoğrafları Teşhir eden Kabatepe Müzesi Anzak Koyu - Tören Alanı, Kanlısırt Avustralya Anıtı, Kara Savaşlarına Katılan ilk birlik olan 57. Alay Şehitliği,Conkbayırı Yeni Zelanda ve Mustafa Kemel Paşa’nın Conk Bayırında 10 AĞUSTOS 1915 Taarruz emrini verdiği yer olan Atatürk Anıtı gezileri sonrası kaz dağlarının eşsiz güzellikleri içerisinde Altınoluktaki akşam yemeği ve konaklama için hareket ediyoruz',
      dailyPaths: [
        { id: 22, insertUserId: 1 } as TourDailyPath, // Çanakkale
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Gelibolu' },
        { insertUserId: 1, name: 'Kilitbahir' },
        { insertUserId: 1, name: 'Seyit Onbaşı' },
        { insertUserId: 1, name: 'Şahindere Şehitliği' },
        { insertUserId: 1, name: 'Morto Koyu' },
        { insertUserId: 1, name: 'Çanakkale Şehitleri Abidesi' },
        { insertUserId: 1, name: 'Seddülbahir' },
        { insertUserId: 1, name: 'Yahya Çavuş Şehitliği ve Anıtı' },
        { insertUserId: 1, name: 'Alçıtepe' },
        { insertUserId: 1, name: 'Kabatepe Müzesi' },
        { insertUserId: 1, name: 'Anzak Koyu - Tören Alanı' },
        { insertUserId: 1, name: 'Kanlısırt Avustralya Anıtı' },
        { insertUserId: 1, name: '57. Alay Şehitliği' },
        { insertUserId: 1, name: 'Atatürk Anıtı' },
        { insertUserId: 1, name: 'Altınolukt' },
      ],
      breakfeast: 'Otel',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '3.Gün',
      description:
        'Kahvaltı sonrası İzmire hareket. İzmirde Karşıyakada bulunan Zübeyde hanım evini ziyaret ediyoruz. Konağı gezdikten sonra Karşıyaka iskelesinde inip Konağa feribotla geçiyoruz konakta vereceğimiz çay molasından sonra Kadife kaleye çıkıp şehrin panoramik görüntüsünü ve ardından Selçuk’a geçiyoruz. 100 yıldır kazılan ve daha %10’luk bölümü çıkarılabilmiş olan Efes Antik Kenti’ni gezmeye başlıyoruz. Roma Dünyası’nın en büyük 4 kentinden birisi olan Efes’te Odeion, Bouleterion, Yukarı Agora ve Bazilika, Prytaneion (Belediye Sarayı), Domitianus Meydanı, Hermes Yol Taşı, Pollio Çeşmesi, hastane yapısı, Memnius Anıtı, Herakles Kapısı, Kuretler Caddesi, Traianus Çeşmesi, Yamaç Evler, Celsus Kütüphanesi, Hamam ve Latrinler, Hadrianus Tapınağı, Celsus Kütüphanesi, Aşk Evi, Mazeus&Mithridates Kapısı, Ticaret Agorası, Mermer Cadde, Reklam Panosu, Agora, Büyük Tiyatro, Liman Caddesi (Arcadiane Caddesi) görebileceğimiz yerler olacak. Rehberimizin anlatımları eşliğinde yapacağımız gezimizde Efes’teki tarihsel doku bizleri tarihin derinliklerine çekecek. Akşam yemeği ve konaklama için  Kuşadasındaki  e yerleşiyoruz. Akşam barlar sokağı',
      dailyPaths: [
        { id: 22, insertUserId: 1 } as TourDailyPath, // Çanakkale
        { id: 41, insertUserId: 1 } as TourDailyPath, // İzmir
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Zübeyde hanım evi' },
        { insertUserId: 1, name: 'Kadife kale' },
        { insertUserId: 1, name: 'Efes Antik Kenti' },
        {
          insertUserId: 1,
          name: 'Odeion, Bouleterion, Yukarı Agora ve Bazilika, Prytaneion (Belediye Sarayı), Domitianus Meydanı, Hermes Yol Taşı, Pollio Çeşmesi, hastane yapısı, Memnius Anıtı, Herakles Kapısı, Kuretler Caddesi, Traianus Çeşmesi, Yamaç Evler, Celsus Kütüphanesi, Hamam ve Latrinler, Hadrianus Tapınağı, Celsus Kütüphanesi, Aşk Evi, Mazeus&Mithridates Kapısı, Ticaret Agorası, Mermer Cadde, Reklam Panosu, Agora, Büyük Tiyatro, Liman Caddesi (Arcadiane Caddesi)',
        },
        { insertUserId: 1, name: 'barlar sokağı' },
      ],
      breakfeast: 'Otel',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '4.Gün',
      description:
        'Sabah saatlerinde otellimizde yapacağımız kahvaltı sonrası, kuşadasına çıkıp fotoğraf molası veriyoruz. Daha sonra 3 saatlik yol mesafesi bulunan aydın üzerinden Denizliye geçiyoruz. Bergama kralının eşi Hiera adına yaptırdığı aynı zamanda Bizans döneminde Piskoposluk Merkezi de olan şehir (polis) Hierapolis Antik Kenti gezisi içinde ; Cin Delikleri,Sutunlu Yol, Neron Devrin’de yıkılan ve yeni yerine yapılan Antik Tiyatro, Apollon Mabedi,Nekropol,Agora,Çaldağ’dan çıkan kalsiyum oksit içeren ırmağın sularının birikimiyle oluşan Travertenler... görülecektir. Dileyenlere Hierapolis’in sütunlarıyla süslenmiş kutsal havuzda, yüzebilme imkanı (ekstra). Ardından Öğle yemeğini alıyoruz. Saat 16.00 da Hatay’a dönüş ve turumuzu bitiriyoruz. 21 mart 2016 sabah saat 07.00 sularında Antakya’da oluyoruz.',
      dailyPaths: [
        { id: 41, insertUserId: 1 } as TourDailyPath, // İzmir
        { id: 25, insertUserId: 1 } as TourDailyPath, // Denizli
        { id: 65, insertUserId: 1 } as TourDailyPath, // Rize
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Hierapolis Antik Kenti' },
        { insertUserId: 1, name: 'Cin Delikleri' },
        { insertUserId: 1, name: 'Sutunlu Yol' },
        { insertUserId: 1, name: 'Antik Tiyatro' },
        { insertUserId: 1, name: 'Apollon Mabedi' },
        { insertUserId: 1, name: 'Nekropol' },
        { insertUserId: 1, name: 'Agora' },
        { insertUserId: 1, name: 'Travertenler' },
      ],
      breakfeast: 'Otel',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
  ] as TourDaily[];

  tour.tourServices = [
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 1,
        description: '(sayıya göre araç çıkartılacaktır.)',
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 6,
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 9,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 23,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 21,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 8,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 22,
      },
    },
  ] as TourService[];

  tour.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733310358/dev/tour/2024-12-04/5/h0yjgu23jwdl9g6gxbu8.webp',
      format: 'webp',
      width: 806,
      height: 646,
      publicId: 'dev/tour/2024-12-04/5/h0yjgu23jwdl9g6gxbu8',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733310358/dev/tour/2024-12-04/5/h0yjgu23jwdl9g6gxbu8.webp',
      order: 1,
      createdAt: new Date('2024-12-04T08:05:58.000Z'),
      originalName: 'ege-turu-806-646.webp',
      insertUserId: 1,
    } as Image,
  ];

  await TourRepository.save(tour);
};

const GuneyDoguTuru = async (dataSource: DataSource) => {
  const TourRepository = dataSource.getRepository(Tour);

  const today = new Date();

  const tour = new Tour();

  tour.title = 'Güneydoğu Turu';
  tour.spot = 'Güneydoğu Turu';
  tour.body = '';
  tour.tourType = TourType.YURTICI;
  tour.publishStatus = PublishStatus.PUBLISH;
  tour.publishDate = new Date(today.getDate() - 10);
  tour.startDate = new Date('2024-10-10');
  tour.endDate = new Date('2024-10-12');
  tour.seoLink = await generateUniqueSeoLink(tour.title, 'tour');
  tour.insertUserId = 1;

  tour.category = { id: 8 } as TourCategory;
  tour.tags = [
    { id: 31 } as Tag,
    { id: 20 } as Tag,
    { id: 16 } as Tag,
    { id: 10 } as Tag,
    { id: 50 } as Tag,
    { id: 51 } as Tag,
    { id: 52 } as Tag,
  ];

  tour.tourDates = [
    {
      insertUserId: 1,
      startDate: '2024-6-1',
      endDate: '2024-6-3',
      description: 'Guided tour of the city',
      isActive: true,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2024-7-1'),
      endDate: new Date('2024-7-3'),
      description: 'Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2024-8-1'),
      endDate: new Date('2024-8-3'),
      description: 'Very Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: '(2-3 Kişilik Oda da Kişi Başı)',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (6-9 yaş)',
          price: 7500,
          currency: 'try',
          description: '(İki yetiskin yaninda kalinacaksa)',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (3-6 yaş)',
          price: 7500,
          currency: 'try',
          description: '(İki yetiskin yaninda kalinacaksa)',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
    {
      insertUserId: 1,
      startDate: '2025-6-1',
      endDate: '2025-6-3',
      description: 'Guided tour of the city',
      isActive: true,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2025-7-1'),
      endDate: new Date('2025-7-3'),
      description: 'Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2025-8-1'),
      endDate: new Date('2025-8-3'),
      description: 'Very Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: '(2-3 Kişilik Oda da Kişi Başı)',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (6-9 yaş)',
          price: 7500,
          currency: 'try',
          description: '(İki yetiskin yaninda kalinacaksa)',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (3-6 yaş)',
          price: 7500,
          currency: 'try',
          description: '(İki yetiskin yaninda kalinacaksa)',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
  ] as TourDate[];

  tour.dailyForms = [
    {
      insertUserId: 1,
      name: '1.Gün',
      description:
        'Akşamı saat 22.30 da Daha önce belirlenen noktalarda toplanma ve Gaziantep, Şanlıurfa güzergahından yapacağımız molalar ardından Diyarbakır’a harekeket ediyoruz',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
        { id: 26, insertUserId: 1 } as TourDailyPath, // Diyarbakır
      ],
      dailyVisitingPlaces: [] as TourDailyVisitingPlace[],
      breakfeast: '',
      lunch: '',
      dinner: '',
    },
    {
      insertUserId: 1,
      name: '2.Gün',
      description:
        'Avrupa’yı binlerce yıl birbirine bağlayan tarihi İpek Yolu’ndan geçerek Diyarbakır’a varıyoruz  Diyarbakır Hasan Paşa Hanında yöresel kahvaltımızı yaptıktan sonra(ekstra) Mardin Kapı ve Çin Setinden sonra en uzun tarihi surları geziyoruz keçi burcunda rehberimiz eşliğinde eysel bağları ve gazi köşkünü izliyoruz daha sonra 1.5 saatlik yol mesafesi bulunan Batmana geçiyoruz Batman’da otobüsümüzle şehir merkezinden geçerek Batman Petrol Rafinerini  görüyoruz daha sonra Raman dağlarından geçerek Hasankeyfe varıyoruz. Dicle’nin kıyısında masal kitaplarından bir sahnedir adeta Hasankeyf. Yeni Hasankeyf te vereceğimiz  moladan  sonra 45 dakikalık süren yolculuğun ardından Midyat’da eski taş evlerle çevrili dar sokaklarda yapacağımız yürüyüşle Konukevi (Sıla Konağı), Eski Han ve Gümüşçülerin gezilmesinden sonra konaklama ve akşam yemeği için 1 saatlik yol mesafesi olan büyülü kent Mardin’e varıyoruz.',
      dailyPaths: [
        { id: 26, insertUserId: 1 } as TourDailyPath, // Diyarbakır
        { id: 14, insertUserId: 1 } as TourDailyPath, // Batman
        { id: 57, insertUserId: 1 } as TourDailyPath, // Mardin
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Hasan Paşa Hanı' },
        { insertUserId: 1, name: 'Mardin Kapı ve Çin Seti' },
        { insertUserId: 1, name: 'eysel bağları' },
        { insertUserId: 1, name: 'gazi köşkü' },
        { insertUserId: 1, name: 'Batman Petrol Rafineri' },
        { insertUserId: 1, name: 'Hasankeyf' },
        { insertUserId: 1, name: 'Sıla Konağı' },
        { insertUserId: 1, name: 'Eski Han ve Gümüşçüler' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: '(Ekstra)',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '3.Gün',
      description:
        'otelimizde  sabah kahvaltımızı yaptıktan sonra. Farklı dini inanışların ve kültürlerin iç içe geçtiği Mardin’de 12 km uzaklıktaki Deyr-ul zafaran kilisesine geçerek rahiplerin rehberliğinde Süryani kilisesinin içini gezerek bilgi alıyoruz Daha sonra Kasımiye Medresesini, Kent Müzesini, ve Anadolu’nun en eski camilerinden biri olan Ulu Camii’yi gezdikten sonra Mardin kebabını tadacağımız öğle yemeği molamızı veriyoruz. Yemekten sonra Süryani taş işlemeciliğinin şaheserlerinden Şatana Konağı (PTT Binası), Erdoba Konağı, eski ev ve çarşıları gezerek Mardin’in kalbine yolculuğumuz devam edecek.  Daha sonra Antakya’ya dönüş.',
      dailyPaths: [
        { id: 57, insertUserId: 1 } as TourDailyPath, // Mardin
        { id: 37, insertUserId: 1 } as TourDailyPath, // Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Deyr-ul zafaran' },
        { insertUserId: 1, name: 'Süryani kilisesi' },
        { insertUserId: 1, name: 'Kasımiye Medresesi' },
        { insertUserId: 1, name: 'Kent Müzesi' },
        { insertUserId: 1, name: 'Ulu Camii' },
        { insertUserId: 1, name: 'Şatana Konağı' },
        { insertUserId: 1, name: 'Erdoba Konağı' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: 'Acenta',
      dinner: 'Ekstra',
    },
  ] as TourDaily[];

  tour.tourServices = [
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 1,
        description: '(sayıya göre araç çıkartılacaktır.)',
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 6,
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 9,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 23,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 21,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 8,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 22,
      },
    },
  ] as TourService[];

  tour.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733310467/dev/tour/2024-12-04/6/zi65u6v0piroxjudemfk.jpg',
      format: 'jpg',
      width: 806,
      height: 646,
      publicId: 'dev/tour/2024-12-04/6/zi65u6v0piroxjudemfk',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733310467/dev/tour/2024-12-04/6/zi65u6v0piroxjudemfk.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T08:07:47.000Z'),
      originalName: 'guneydogu-turu-806-646.jpg',
      insertUserId: 1,
    } as Image,
  ];

  await TourRepository.save(tour);
};

const AnkaraEskisehirTuru = async (dataSource: DataSource) => {
  const TourRepository = dataSource.getRepository(Tour);

  const today = new Date();

  const tour = new Tour();

  tour.title = 'Ankara / Eskişehir Turu';
  tour.spot = 'Ankara / Eskişehir Turu';
  tour.body = '';
  tour.tourType = TourType.YURTICI;
  tour.publishStatus = PublishStatus.PUBLISH;
  tour.publishDate = new Date(today.getDate() - 10);
  tour.startDate = new Date('2024-10-10');
  tour.endDate = new Date('2024-10-12');
  tour.seoLink = await generateUniqueSeoLink(tour.title, 'tour');
  tour.insertUserId = 1;

  tour.category = { id: 8 } as TourCategory;
  tour.tags = [{ id: 31 } as Tag, { id: 20 } as Tag];

  tour.tourDates = [
    {
      insertUserId: 1,
      startDate: '2024-11-10',
      endDate: '2024-11-12',
      description: 'Guided tour of the city',
      isActive: true,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2024-12-10'),
      endDate: new Date('2024-12-12'),
      description: 'Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'try',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2025-11-10'),
      endDate: new Date('2025-11-12'),
      description: 'Very Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'try',
          description: '(2-3 Kişilik Oda da Kişi Başı)',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (6-9 yaş)',
          price: 7500,
          currency: 'try',
          description: '(İki yetiskin yaninda kalinacaksa)',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (3-6 yaş)',
          price: 7500,
          currency: 'try',
          description: '(İki yetiskin yaninda kalinacaksa)',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'try',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'try' },
      ],
    },
  ] as TourDate[];

  tour.dailyForms = [
    {
      insertUserId: 1,
      name: '1.Gün',
      description:
        'Hİskenderun Adana- Pozantı ve Aksaray’dan geçerek sabah saatlerinde Tuz Gölü’nde vereceğimiz mola sonrası  Ankara’ya varıyoruz. Sabah kahvaltısından sonra ilk olarak Atatürk Orman Çiftliği ve Atatürk Evi ANITKABİR ziyaret gezisi  Öğle Yemeği aramızı veriyoruz 1.TBMM gezisi 2.TBMM Cumhuriyet Müzesi MTA tabiat tarihleri müzesi gezisi ardından Ankara’dan ayrılıyoruz.  ile Eskişehir’e geçerek ordan akşam yemeği ve konaklama için otelimize geçiyoruz. ',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
        { id: 7, insertUserId: 1 } as TourDailyPath, // Ankara
        { id: 32, insertUserId: 1 } as TourDailyPath, // Eskişehir
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Tuz Gölü' },
        { insertUserId: 1, name: 'Atatürk Orman Çiftliği' },
        { insertUserId: 1, name: 'Atatürk Evi' },
        { insertUserId: 1, name: 'ANITKABİR' },
        { insertUserId: 1, name: '1.TBMM' },
        { insertUserId: 1, name: '2.TBMM Cumhuriyet Müzesi' },
        { insertUserId: 1, name: 'MTA tabiat tarihleri müzesi' },
      ] as TourDailyVisitingPlace[],
      breakfeast: 'Ekstra',
      lunch: 'Acenta',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '2.Gün',
      description:
        'Sabah otelimizde yapacağımız kahvaltı sonrası Porsuk Çayı ( Adalar, Çarşı) etrafında serbest zaman veriyoruz. Porsuk çayında gezinti Akabinde Odunpazarı Kurşunlu Külliyesi cam müzesi ve lületaşı müzesini gezerek ordan öğlen yemeği molası sonrası Buradan ayrıldıktan sonra saat 13.00 da sonrasındaYılmaz BÜYÜKERŞEN imzalı Bal Mumu Heykel Müzesini zamanda yolculuk yaparcasına keyifle geziyoruz. Ardından sahiliyle, havuzlarıyla, kafeteryalarıyla adından söz ettiren Kent Parkı ziyaret ediyoruz. Masal park korsan gemisi ve akvaryum (ekstra) Son olarak günün yorgunluğunu şelale parktan sonra dönüş  yolculuğü',
      dailyPaths: [
        { id: 32, insertUserId: 1 } as TourDailyPath, // Eskişehir
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Porsuk Çayı ( Adalar, Çarşı)' },
        { insertUserId: 1, name: 'Odunpazarı Kurşunlu Külliyesi' },
        { insertUserId: 1, name: 'cam müzesi' },
        { insertUserId: 1, name: 'lületaşı müzesi' },
        { insertUserId: 1, name: 'Bal Mumu Heykel Müzesi' },
        { insertUserId: 1, name: 'Kent Parkı' },
        { insertUserId: 1, name: 'Masal park korsan gemisi' },
        { insertUserId: 1, name: 'akvaryum (ekstra)' },
        { insertUserId: 1, name: 'şelale parkt' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: 'Ekstra',
      dinner: '',
    },
  ] as TourDaily[];

  tour.tourServices = [
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 1,
        description: '(sayıya göre araç çıkartılacaktır.)',
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 6,
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 9,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 23,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 21,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 8,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 22,
      },
    },
  ] as TourService[];

  tour.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733310742/dev/tour/2024-12-04/7/xt5fyorimzdngotdk9pv.jpg',
      format: 'jpg',
      width: 806,
      height: 646,
      publicId: 'dev/tour/2024-12-04/7/xt5fyorimzdngotdk9pv',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733310742/dev/tour/2024-12-04/7/xt5fyorimzdngotdk9pv.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T08:12:22.000Z'),
      originalName: 'eskisehir-ankara-turu-806-646.jpg',
      insertUserId: 1,
    } as Image,
  ];

  await TourRepository.save(tour);
};

const OrtaAvrupaBalkanTuru = async (dataSource: DataSource) => {
  const TourRepository = dataSource.getRepository(Tour);

  const today = new Date();

  const tour = new Tour();

  tour.title = 'Orta Avrupa Balkan Turu';
  tour.spot = 'Orta Avrupa Balkan Turu';
  tour.body = `Turumuz her gece otel konaklaması olacak şeklinde planlanmıştır. Gündüzleri ise şehirleri keşfediyor olacağız. Konaklama şehirleri: Ohrid, Prizren, Budva, Trebinje, Saraybosna (2 gece), Budapeşte (2 gece), Niş
  Oteller Balkan coğrafyasının en popüler şehirlerinde katılımcılarımızın rahat edeceği şekilde 3, 4 ve 5 yıldızlı zincir otellerde 2 kişilik odalardan seçilmiştir
  ÜLKELER VE ŞEHİRLER

    YUNANİSTAN­– Selanik

    K.­MAKEDONYA­– Manastır, Ohrid, Üsküp, Kalkandelen

    KOSOVA­- Prizren

    KARADAĞ­- Kotor, Budva

    HIRVATİSTAN­– Dubrovnik

    BOSNA­HERSEK­– Trebinje, Mostar, Blagaj,

    Saraybosna, Poçitel

    MACARİSTAN­-­Budapeşte, Mohaç

    SIRBİSTAN­-­Belgrad, Niş

    BULGARİSTAN­-­Sofya

    SEYAHAT ÖNCESİ: Tur başlangıç günü size bildirilen saatte İstanbul Forum AVM önünde buluşma, sizleri karşılayacak yol danışmanları eşliğinde otobüse valizlerin yerleştirilmesi, koltuk kurasının çekilmesi ve son kontrollerin yapılması. yol danışmanlarının seyahat öncesi sizlere son tüyoları vermesi ve rehberiniz ile tanışma. Kura ile çekmiş olduğunuz koltuklara yerleşme ve seyahatin 22.00’de başlaması. İpsala sınır kapısına varış ve pasaport & vize işlemlerinin yapılması
  `;

  tour.tourType = TourType.YURTDISI;
  tour.publishStatus = PublishStatus.PUBLISH;
  tour.publishDate = new Date(today.getDate());
  tour.startDate = new Date('2024-07-14');
  tour.endDate = new Date('2024-07-24');
  tour.seoLink = await generateUniqueSeoLink(tour.title, 'tour');
  tour.insertUserId = 1;

  tour.category = { id: 14 } as TourCategory;
  tour.tags = [{ id: 3 } as Tag, { id: 4 } as Tag];

  tour.tourDates = [
    {
      insertUserId: 1,
      startDate: '2024-07-14',
      endDate: '2024-07-24',
      description: 'Guided tour of the city',
      isActive: true,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'eur',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'eur',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'eur',
          description: '65 Yaş ve Üzeri',
        },
      ],
    },
    {
      insertUserId: 1,
      startDate: new Date('2024-08-12'),
      endDate: new Date('2024-08-22'),
      description: 'Special holiday tour',
      isActive: false,
      prices: [
        {
          insertUserId: 1,
          name: 'Yetişkin',
          price: 10000,
          currency: 'eur',
          description: 'Yetişkin Fiyatı',
        },
        {
          insertUserId: 1,
          name: 'Çocuk (0-7 yaş)',
          price: 7500,
          currency: 'eur',
          description: 'Çocuk Fiyatı',
        },
        {
          insertUserId: 1,
          name: '65+ Yaş',
          price: 8000,
          currency: 'eur',
          description: '65 Yaş ve Üzeri',
        },
        { insertUserId: 1, name: 'VIP', price: 15000, currency: 'eur' },
      ],
    },
  ] as TourDate[];

  tour.dailyForms = [
    {
      insertUserId: 1,
      name: '1.Gün',
      description:
        'Selanik’e varış ve kahvaltı. Ardından Selanik şehir turu. Selanik’te görülecek yerler arasında Atatürk’ün evi, Kordon, Beyaz Kule ve Osmanlı ve Bizans eserleri. Panoramik şehir turu ve serbest zamanın ardından Manastır Askeri İdadisine varış. Atatürk’ün askeri eğitim aldığı okulu ziyaret ediyoruz. Gezi sonrası Ohrid’e hareket. Yolculuk sonrası rehberimiz eşliğinde şehir turu. Gezinin ardından otele transfer. Geceleme OHRİD otelimizde',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Selanik' },
        { insertUserId: 1, name: 'Atatürk’ün evi' },
        { insertUserId: 1, name: 'Kordon' },
        { insertUserId: 1, name: 'Beyaz Kule' },
        { insertUserId: 1, name: 'Osmanlı ve Bizans eserleri' },
        { insertUserId: 1, name: 'Manastır Askeri İdadisi' },
        { insertUserId: 1, name: 'Atatürk’ün askeri eğitim aldığı okul' },
        { insertUserId: 1, name: 'Ohrid' },
      ] as TourDailyVisitingPlace[],
      breakfeast: 'Otel',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '2.Gün',
      description:
        'Sabah kahvaltının ardından Kalkandelen’e hareket. Varışın ardından rehber eşliğinde şehir turu yapıyoruz. Ardından Üsküp’e hareket. Yolculuk sonrası rehberimiz eşliğinde Türk Çarşısı, Makedonya Meydanı, Taş Köprü, Üsküp Kalesi görülecek yerlerden bazıları. Sonrasında Prizren’e hareket. Varışın ardından rehberli Prizren turu. Gezi sonrası otele transfer. Geceleme PRİZREN otelimizde.',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Kalkandelen' },
        { insertUserId: 1, name: 'Üsküp' },
        { insertUserId: 1, name: 'Türk Çarşısı' },
        { insertUserId: 1, name: 'Makedonya Meydanı,' },
        { insertUserId: 1, name: 'Taş Köprü' },
        { insertUserId: 1, name: 'Üsküp Kalesi' },
        { insertUserId: 1, name: 'Prizren' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '3.Gün',
      description:
        'Sabah kahvaltının ardından Arnavutluk’un en eski şehirlerinden İşkodya’ya hareket. Varışın ardından rehber eşliğinde şehir turu. Gezi sonrası Karadağ’ın sahil şehri Budva’ya varış. Rehber eşliğinde kalenin içerisinde kalan eski şehir bölgesini geziyoruz. Yolculuk sonrası Kotor’a hareket. Surlar içerisinde kalan Kotor sokaklarını rehber eşliğinde geziyoruz. Gezi sonrası otele transfer. Geceleme Karadağ bölgesindeki otelimizde.',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Arnavutluk' },
        { insertUserId: 1, name: 'İşkodya' },
        { insertUserId: 1, name: 'Karadağ’' },
        { insertUserId: 1, name: 'Budva' },
        { insertUserId: 1, name: 'Kotor' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '4.Gün',
      description:
        'Sabah kahvaltının ardından Hırvatistan’ın Duvrovnik şehrine hareket. Varışın ardından Game of Thrones dizisinin çekildiği eski şehir bölgesini geziyoruz. Gezinin ardından Trebinje’ye hareket. Yolculuk sonrası otele transfer. Geceleme TREBİNJE otelimizde.',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Duvrovnik' },
        { insertUserId: 1, name: 'Game of Thrones dizisi' },
        { insertUserId: 1, name: 'Trebinje' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '5.Gün',
      description:
        'Sabah kahvaltının ardından Bosna Hersek’in güneyinde kurulmuş tarihi bir Osmanlı yerleşimi, Poçitel’e hareket. Varışın ardından rehberli şehir turu. Gezi sonrası sırasıyla Osmanlı döneminde bir bektaşi dergahı olan Blagay Tekkesi’ni ve Balkanlar’ın en dikkat çekici turistik şehirlerinden Mostar’ı geziyoruz. Geziler sonrası Bosna Hersek’in başkenti Saraybosna’ya hareket. Yolculuk sonrası otele transfer. Geceleme SARAYBOSNA otelimizde',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Bosna Hersek' },
        { insertUserId: 1, name: 'Poçitel' },
        { insertUserId: 1, name: 'Blagay Tekkesi' },
        { insertUserId: 1, name: 'Mostar' },
        { insertUserId: 1, name: 'Saraybosna' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '6.Gün',
      description:
        'Sabah kahvaltı sonrası rehberimiz eşliğinde Saraybosna şehir turu. Başçarşı, Gazi Hüsrev Bey Camii, Sonsuz Ateş, Morica Han görülecek yerlerden bazıları. Gezi sonrası otele transfer. Geceleme SARAYBOSNA otelimizde.',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Saraybosna' },
        { insertUserId: 1, name: 'Başçarşı' },
        { insertUserId: 1, name: 'Gazi Hüsrev Bey Camii,' },
        { insertUserId: 1, name: 'Sonsuz Ateş' },
        { insertUserId: 1, name: 'Morica Han' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '7.Gün',
      description:
        'Sabah kahvaltı sonrası Mohaç Meydan Muharebesi’ne tanık olmuş Macar kasabasını ziyaret ediyoruz. Ardından Macaristan’nın başkenti Budapeşte’ye hareket. Varışın ardından otele transfer. Geceleme BUDAPEŞTE otelimizde.',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Mohaç Meydan Muharebesi' },
        { insertUserId: 1, name: 'Budapeşte' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '8.Gün',
      description: `Kahvaltının ardından rehber eşliğinde Budapeşte şehir turu. Rehber eşliğinde gezilecek yerler arasında Kahramanlar Meydanı, Gallert Tepesi, Elizabeth Köprüsü, Budin Kalesi, Palemento Binası ve Zincirli Köprü bulunmaktadır. Budapeşte'yi akşamları daha çok seveceksiniz. Işıkların adeta dans ettiği bu muhteşem şehrin hafızalarınızda güzel bir anı olarak yer edeceğinden emin olabilirsiniz. Şehir turundan ardından otele transfer. Geceleme BUDAPEŞTE otelimizde.`,
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Budapeşte' },
        { insertUserId: 1, name: 'Kahramanlar Meydanı' },
        { insertUserId: 1, name: 'Gallert Tepesi' },
        { insertUserId: 1, name: 'Elizabeth Köprüsü' },
        { insertUserId: 1, name: 'Budin Kalesi' },
        { insertUserId: 1, name: 'Palemento Binası' },
        { insertUserId: 1, name: 'Zincirli Köprü' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '9.Gün',
      description:
        'Sabah kahvaltının ardından Belgrad’a hareket. Varışın ardından canlılığın ve hareketliliğin sembolü Avrupa’nın en eski kentlerinden biri olan Belgrad şehir turu yapıyoruz. Sava Nehri’nin Tuna’ya katıldığı noktada Fatih Sultan Mehmet’in uğruna yaralandığı ama fethinin Kanuni Sultan Süleyman’a nasip olduğu Osmanlı donanmasının ikmal merkezlerinden Belgrad Kalesi, Kale Meydanı, Knez Mihailova Caddesi gezilecek yerlerden bazılarıdır. Verilecek serbest zamanın ardından Niş’e hareket. Yolculuk sonrası otele transfer. Geceleme NİŞ otelimizde.',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Belgrad’' },
        { insertUserId: 1, name: 'Sava Nehri' },
        { insertUserId: 1, name: 'Belgrad Kalesi' },
        { insertUserId: 1, name: 'Kale Meydanı' },
        { insertUserId: 1, name: 'Knez Mihailova Caddesi' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: 'Ekstra',
      dinner: 'Otel',
    },
    {
      insertUserId: 1,
      name: '10.Gün',
      description:
        'Sabah kahvaltının ardından Sırbistan’ın en büyük üçüncü şehri Niş’i rehber eşliğinde geziyoruz. Gezi sonrası Sofya’ya hareket. Sofya’ya varışın ardından rehberimiz eşliğinde şehir turu. Aleksander Nevski Katedrali, Banyabaşı Cami, Eski Şehir bölgesini gezdikten sonra serbest zaman. Gezinin ardından ardından İstanbul’a hareket. Akşam 00.00 gibi İstanbul’a varış. Bir sonraki Rüya Rota’da buluşmak üzere…',
      dailyPaths: [
        { id: 37, insertUserId: 1 } as TourDailyPath, //Hatay
      ],
      dailyVisitingPlaces: [
        { insertUserId: 1, name: 'Niş' },
        { insertUserId: 1, name: 'Sofya' },
        { insertUserId: 1, name: 'Aleksander Nevski Katedrali' },
        { insertUserId: 1, name: 'Banyabaşı Cami' },
        { insertUserId: 1, name: 'Eski Şehir' },
      ],
      breakfeast: 'Otel Açık Büfe',
      lunch: 'Ekstra',
      dinner: '',
    },
  ] as TourDaily[];

  tour.tourServices = [
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 1,
        description: '(sayıya göre araç çıkartılacaktır.)',
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 6,
      },
    },
    {
      type: ServiceType.INCLUDED,
      service: {
        id: 9,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 23,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 21,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 8,
      },
    },
    {
      type: ServiceType.EXCLUDED,
      service: {
        id: 22,
      },
    },
  ] as TourService[];

  tour.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733311320/dev/tour/2024-12-04/8/eyk01pxbyurpl8mhhzpi.jpg',
      format: 'jpg',
      width: 806,
      height: 646,
      publicId: 'dev/tour/2024-12-04/8/eyk01pxbyurpl8mhhzpi',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733311320/dev/tour/2024-12-04/8/eyk01pxbyurpl8mhhzpi.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T08:22:00.000Z'),
      originalName: 'orta-avrupa-balkanlar-turu-806-646.jpg',
      insertUserId: 1,
    } as Image,
  ];

  await TourRepository.save(tour);
};

export default seedTours;
