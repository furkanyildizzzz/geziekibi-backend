import { HomepageSlider } from 'orm/entities/homepageSlider/HomepageSlider';
import { Image } from 'orm/entities/image/Image';
import { DataSource } from 'typeorm';

const seedHomepageSliders = async (dataSource: DataSource) => {
  const HomeSliderRepository = dataSource.getRepository(HomepageSlider);

  let sliders = [
    {
      order: 1,
      isActive: true,
      image: {
        url: 'http://res.cloudinary.com/furkannn/image/upload/v1737900403/dev/homepageSlider/lkwbckr3l1ulsnpxw1jw.jpg',
        format: 'jpg',
        width: 806,
        height: 646,
        publicId: 'dev/homepageSlider/lkwbckr3l1ulsnpxw1jw.jpg',
        secureUrl:
          'https://res.cloudinary.com/furkannn/image/upload/v1737900403/dev/homepageSlider/lkwbckr3l1ulsnpxw1jw.jpg',
        order: 1,
        originalName: 'Geziekibi',
      } as Image,
    },
    {
      order: 2,
      isActive: true,
      image: {
        url: 'http://res.cloudinary.com/furkannn/image/upload/v1737900425/dev/homepageSlider/tnojfpjub35vwnd0hjwj.jpg',
        format: 'jpg',
        width: 806,
        height: 646,
        publicId: 'dev/homepageSlider/tnojfpjub35vwnd0hjwj.jpg',
        secureUrl:
          'https://res.cloudinary.com/furkannn/image/upload/v1737900425/dev/homepageSlider/tnojfpjub35vwnd0hjwj.jpg',
        order: 1,
        originalName: 'Geziekibi',
      } as Image,
    },
    {
      order: 3,
      isActive: true,
      image: {
        url: 'http://res.cloudinary.com/furkannn/image/upload/v1737900437/dev/homepageSlider/ku0ikzypnhyjpjxbrrgp.jpg',
        format: 'jpg',
        width: 806,
        height: 646,
        publicId: 'dev/homepageSlider/ku0ikzypnhyjpjxbrrgp.jpg',
        secureUrl:
          'https://res.cloudinary.com/furkannn/image/upload/v1737900437/dev/homepageSlider/ku0ikzypnhyjpjxbrrgp.jpg',
        order: 1,
        originalName: 'Geziekibi',
      } as Image,
    },
  ];

  await HomeSliderRepository.save(sliders);
  console.log('All sliders have been seeded!');
};

export default seedHomepageSliders;
