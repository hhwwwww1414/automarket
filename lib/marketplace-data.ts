export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  city: string;
  imageUrl: string;
  images: string[];
  videoUrl?: string;
  interiorImages?: string[];
  reportUrl?: string;
  engine: string;
  power: number;
  transmission: string;
  drive: string;
  bodyType: string;
  color: string;
  owners: number;
  steering: string;
  generation: string;
  trim: string;
  vin: string;
  verified: boolean;
  priceStatus: 'low' | 'normal' | 'high';
  description: string;
  seller: {
    type: 'owner' | 'dealer';
    name: string;
    rating?: number;
    onPlatformSince: string;
    verified: boolean;
    phone?: string;
  };
  createdAt: string;
}

export const vehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Лада',
    model: 'Искра',
    year: 2025,
    price: 1290000,
    mileage: 1200,
    city: 'Белгород',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
    ],
    engine: '1.6 л / Бензин',
    power: 106,
    transmission: 'Вариатор',
    drive: 'Передний',
    bodyType: 'Хэтчбек',
    color: 'Белый',
    owners: 1,
    steering: 'Левый',
    generation: 'I',
    trim: 'Comfort',
    vin: 'XTA21****0012****',
    verified: true,
    priceStatus: 'normal',
    description: 'Автомобиль куплен новым у официального дилера, на гарантии, сделано 0-ТО. Состояние идеальное, не требует вложений. Один владелец, все ТО по регламенту. Комплектация Comfort: кондиционер, мультимедиа, камера заднего вида, подогрев сидений.',
    seller: {
      type: 'owner',
      name: 'Алексей',
      onPlatformSince: '2023',
      verified: true,
      phone: '+7 (999) ***-**-12',
    },
    createdAt: '2025-03-15',
  },
  {
    id: '2',
    make: 'Skoda',
    model: 'Rapid',
    year: 2021,
    price: 1850000,
    mileage: 45000,
    city: 'Москва',
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    ],
    engine: '1.6 л / Бензин',
    power: 110,
    transmission: 'АКПП',
    drive: 'Передний',
    bodyType: 'Лифтбек',
    color: 'Серый',
    owners: 2,
    steering: 'Левый',
    generation: 'II',
    trim: 'Style',
    vin: 'XW8ZZ****1234****',
    verified: true,
    priceStatus: 'normal',
    description: 'Skoda Rapid в отличном состоянии. Полностью обслужен, все жидкости заменены. Резина новая, тормоза в идеале.',
    seller: {
      type: 'dealer',
      name: 'АвтоМир Москва',
      rating: 4.7,
      onPlatformSince: '2020',
      verified: true,
    },
    createdAt: '2025-03-18',
  },
  {
    id: '3',
    make: 'Toyota',
    model: 'Mark X',
    year: 2017,
    price: 2150000,
    mileage: 78000,
    city: 'Владивосток',
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
    ],
    engine: '2.5 л / Бензин',
    power: 203,
    transmission: 'АКПП',
    drive: 'Задний',
    bodyType: 'Седан',
    color: 'Чёрный',
    owners: 2,
    steering: 'Правый',
    generation: 'II (X130)',
    trim: 'Premium',
    vin: 'GRX13****5678****',
    verified: true,
    priceStatus: 'low',
    description: 'Toyota Mark X в максимальной комплектации. Кожаный салон, климат-контроль, все опции. Правый руль, документы в порядке.',
    seller: {
      type: 'owner',
      name: 'Дмитрий',
      onPlatformSince: '2024',
      verified: true,
    },
    createdAt: '2025-03-10',
  },
  {
    id: '4',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2011,
    price: 1350000,
    mileage: 156000,
    city: 'Санкт-Петербург',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    ],
    engine: '1.8 л / Бензин',
    power: 184,
    transmission: 'АКПП',
    drive: 'Задний',
    bodyType: 'Седан',
    color: 'Серебристый',
    owners: 3,
    steering: 'Левый',
    generation: 'W204',
    trim: 'Avantgarde',
    vin: 'WDD20****9012****',
    verified: false,
    priceStatus: 'normal',
    description: 'Mercedes C180 W204. Обслуживался у официалов. Есть мелкие недостатки по кузову, требуется покраска заднего бампера.',
    seller: {
      type: 'owner',
      name: 'Сергей',
      onPlatformSince: '2022',
      verified: false,
    },
    createdAt: '2025-03-12',
  },
  {
    id: '5',
    make: 'Skoda',
    model: 'Octavia',
    year: 2018,
    price: 1750000,
    mileage: 89000,
    city: 'Краснодар',
    imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop',
    ],
    engine: '1.4 л / Бензин',
    power: 150,
    transmission: 'Робот',
    drive: 'Передний',
    bodyType: 'Лифтбек',
    color: 'Синий',
    owners: 1,
    steering: 'Левый',
    generation: 'A7 (III)',
    trim: 'Style',
    vin: 'XW8AD****3456****',
    verified: true,
    priceStatus: 'normal',
    description: 'Octavia A7 в идеальном состоянии. Один владелец, вся история по ключу. DSG работает без нареканий, масло менялось каждые 40 тыс.',
    seller: {
      type: 'owner',
      name: 'Игорь',
      onPlatformSince: '2023',
      verified: true,
    },
    createdAt: '2025-03-17',
  },
  {
    id: '6',
    make: 'Лада',
    model: '2112',
    year: 2008,
    price: 180000,
    mileage: 198000,
    city: 'Воронеж',
    imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop',
    ],
    engine: '1.6 л / Бензин',
    power: 89,
    transmission: 'МКПП',
    drive: 'Передний',
    bodyType: 'Хэтчбек',
    color: 'Зелёный',
    owners: 4,
    steering: 'Левый',
    generation: 'I',
    trim: 'Стандарт',
    vin: 'XTA21124****7890',
    verified: false,
    priceStatus: 'low',
    description: 'Продаю 2112 в рабочем состоянии. Ездит каждый день, требует небольших вложений. Торг при осмотре.',
    seller: {
      type: 'owner',
      name: 'Виктор',
      onPlatformSince: '2024',
      verified: false,
    },
    createdAt: '2025-03-14',
  },
  {
    id: '7',
    make: 'Hyundai',
    model: 'Solaris',
    year: 2020,
    price: 1450000,
    mileage: 52000,
    city: 'Екатеринбург',
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop',
    ],
    engine: '1.6 л / Бензин',
    power: 123,
    transmission: 'АКПП',
    drive: 'Передний',
    bodyType: 'Седан',
    color: 'Белый',
    owners: 1,
    steering: 'Левый',
    generation: 'II',
    trim: 'Elegance',
    vin: 'Z94K2****1234****',
    verified: true,
    priceStatus: 'normal',
    description: 'Hyundai Solaris II в максимальной комплектации Elegance. Кожа, климат, камера, навигация. Пробег честный, все ТО у дилера.',
    seller: {
      type: 'dealer',
      name: 'Автоцентр Урал',
      rating: 4.5,
      onPlatformSince: '2019',
      verified: true,
    },
    createdAt: '2025-03-16',
  },
  {
    id: '9',
    make: 'Toyota',
    model: 'Land Cruiser',
    year: 2022,
    price: 8900000,
    mileage: 32000,
    city: 'Москва',
    imageUrl: '/cars/cruiser/cruiser.jpg',
    images: [
      '/cars/cruiser/cruiser.jpg',
      '/cars/cruiser/cruiser1.jpg',
      '/cars/cruiser/cruiser2.jpg',
      '/cars/cruiser/cruiser3.jpg',
      '/cars/cruiser/cruiser4.jpg',
    ],
    videoUrl: '/cars/cruiser/cruiser.MOV',
    interiorImages: [
      '/cars/cruiser/salon/salon.jpg',
      '/cars/cruiser/salon/salon1.jpg',
      '/cars/cruiser/salon/salon2.jpg',
      '/cars/cruiser/salon/salon3.jpg',
      '/cars/cruiser/salon/salon4.jpg',
      '/cars/cruiser/salon/salon5.jpg',
      '/cars/cruiser/salon/salon6.jpg',
      '/cars/cruiser/salon/salon7.jpg',
      '/cars/cruiser/salon/salon8.jpg',
    ],
    reportUrl: '/cars/cruiser/land_cruiser_300_moscow.pdf',
    engine: '3.5 л / Бензин',
    power: 415,
    transmission: 'АКПП',
    drive: 'Полный',
    bodyType: 'Внедорожник',
    color: 'Чёрный',
    owners: 1,
    steering: 'Левый',
    generation: '300 Series',
    trim: 'Executive Lounge',
    vin: 'JTMHX3J2****0001',
    verified: true,
    priceStatus: 'normal',
    description: 'Toyota Land Cruiser 300 в топовой комплектации Executive Lounge. Один владелец, куплен новым, сервисная книжка у дилера. Панорамная крыша, 4-зонный климат, пневмоподвеска, массаж, вентиляция, проекционный дисплей. Состояние — новый автомобиль.',
    seller: {
      type: 'owner',
      name: 'Михаил',
      onPlatformSince: '2022',
      verified: true,
      phone: '+7 (999) ***-**-09',
    },
    createdAt: '2025-03-20',
  },
  {
    id: '8',
    make: 'Kia',
    model: 'Rio',
    year: 2019,
    price: 1320000,
    mileage: 67000,
    city: 'Новосибирск',
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop',
    ],
    engine: '1.6 л / Бензин',
    power: 123,
    transmission: 'АКПП',
    drive: 'Передний',
    bodyType: 'Седан',
    color: 'Красный',
    owners: 2,
    steering: 'Левый',
    generation: 'IV',
    trim: 'Prestige',
    vin: 'Z94C2****5678****',
    verified: true,
    priceStatus: 'high',
    description: 'Kia Rio в отличном состоянии. Полный электропакет, подогрев всего, круиз-контроль. Небольшой торг возможен.',
    seller: {
      type: 'owner',
      name: 'Андрей',
      onPlatformSince: '2023',
      verified: true,
    },
    createdAt: '2025-03-19',
  },
];

export const popularBrands = [
  { name: 'Лада', count: 45678 },
  { name: 'Toyota', count: 28901 },
  { name: 'Hyundai', count: 23456 },
  { name: 'Kia', count: 21098 },
  { name: 'Mercedes-Benz', count: 18765 },
  { name: 'Volkswagen', count: 16543 },
  { name: 'BMW', count: 15678 },
  { name: 'Nissan', count: 14321 },
  { name: 'Audi', count: 12453 },
  { name: 'Skoda', count: 11234 },
  { name: 'Mazda', count: 9876 },
  { name: 'Chevrolet', count: 8234 },
  { name: 'Ford', count: 7891 },
  { name: 'Mitsubishi', count: 7654 },
  { name: 'Honda', count: 6789 },
  { name: 'Subaru', count: 5432 },
  { name: 'Haval', count: 4567 },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

export function formatMileage(mileage: number): string {
  return new Intl.NumberFormat('ru-RU').format(mileage) + ' км';
}
