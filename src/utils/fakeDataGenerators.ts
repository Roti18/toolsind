import { faker } from "@faker-js/faker";

// Define interfaces for each data type
interface AccountData {
  username: string;
  email: string;
  password: string;
}

interface ProductData {
  name: string;
  price: string;
  category: string;
  stock: number;
}

interface UserProfileData {
  name: string;
  age: number;
  gender: string;
  address: string;
}

interface TransactionData {
  transactionId: string;
  user: string;
  product: string;
  total: string;
  date: string;
}

interface ArticleData {
  title: string;
  content: string;
  category: string;
  author: string;
}

interface GameData {
  name: string;
  genre: string;
  rating: number;
  platform: string;
}

interface VoucherData {
  code: string;
  amount: number;
  expiry: string;
}

interface TestimonialData {
  name: string;
  rating: number;
  comment: string;
}

// Union type for all possible data types
type FakeDataType =
  | AccountData
  | ProductData
  | UserProfileData
  | TransactionData
  | ArticleData
  | GameData
  | VoucherData
  | TestimonialData;

// Generator untuk berbagai jenis data dummy
export function generateFakeData(type: string, count: number): FakeDataType[] {
  const data: FakeDataType[] = [];

  for (let i = 0; i < count; i++) {
    switch (type) {
      case "account":
        data.push({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        } as AccountData);
        break;

      case "product":
        data.push({
          name: faker.commerce.productName(),
          price: faker.commerce.price(),
          category: faker.commerce.department(),
          stock: faker.number.int({ min: 0, max: 100 }),
        } as ProductData);
        break;

      case "userProfile":
        data.push({
          name: faker.person.fullName(),
          age: faker.number.int({ min: 18, max: 60 }),
          gender: faker.person.sexType(),
          address: faker.location.streetAddress(),
        } as UserProfileData);
        break;

      case "transaction":
        data.push({
          transactionId: faker.string.uuid(),
          user: faker.person.fullName(),
          product: faker.commerce.productName(),
          total: faker.commerce.price(),
          date: faker.date.past().toISOString(),
        } as TransactionData);
        break;

      case "article":
        data.push({
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(2),
          category: faker.commerce.department(),
          author: faker.person.fullName(),
        } as ArticleData);
        break;

      case "game":
        data.push({
          name: faker.word.words({ count: 2 }),
          genre: faker.music.genre(),
          rating: parseFloat(
            faker.number.float({ min: 1, max: 5, multipleOf: 0.1 }).toFixed(1)
          ),
          platform: faker.helpers.arrayElement([
            "PC",
            "PlayStation",
            "Xbox",
            "Switch",
          ]),
        } as GameData);
        break;

      case "voucher":
        data.push({
          code: faker.string.alphanumeric(10).toUpperCase(),
          amount: faker.number.int({ min: 10000, max: 500000 }),
          expiry: faker.date.future().toISOString(),
        } as VoucherData);
        break;

      case "testimonial":
        data.push({
          name: faker.person.fullName(),
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
        } as TestimonialData);
        break;

      default:
        throw new Error(`Unknown data type: ${type}`);
    }
  }

  return data;
}

// Type-safe helper functions for specific data types
export function generateAccounts(count: number): AccountData[] {
  return generateFakeData("account", count) as AccountData[];
}

export function generateProducts(count: number): ProductData[] {
  return generateFakeData("product", count) as ProductData[];
}

export function generateUserProfiles(count: number): UserProfileData[] {
  return generateFakeData("userProfile", count) as UserProfileData[];
}

export function generateTransactions(count: number): TransactionData[] {
  return generateFakeData("transaction", count) as TransactionData[];
}

export function generateArticles(count: number): ArticleData[] {
  return generateFakeData("article", count) as ArticleData[];
}

export function generateGames(count: number): GameData[] {
  return generateFakeData("game", count) as GameData[];
}

export function generateVouchers(count: number): VoucherData[] {
  return generateFakeData("voucher", count) as VoucherData[];
}

export function generateTestimonials(count: number): TestimonialData[] {
  return generateFakeData("testimonial", count) as TestimonialData[];
}
