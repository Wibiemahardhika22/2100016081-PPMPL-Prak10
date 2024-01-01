// ! Dont change this code
const {
  fetchProductsData,
  setProductsCards,
  convertToRupiah,
  countDiscount,
} = require("../src/index.js");
const cartData = require("../src/data/cart.js");

// @ Write your code here

// Product API Testing
describe('Product API Testing', () => {
  // fetchProductsData Test Case 1
  test('should return product data with id 1', async () => {
    const productId = 1;
    const productData = await fetchProductsData(productId);
    expect(productData).toBeDefined(); // Memeriksa apakah data produk terdefinisi
    expect(productData.id).toBe(productId); // Memeriksa apakah ID produk sesuai dengan yang diharapkan (1)
    expect(productData.title).toBe('iPhone 9'); // Memeriksa apakah judul produk adalah 'iPhone 9'
    expect(productData.price).toBeGreaterThan(0); // Memeriksa apakah harga produk lebih besar dari 0
    expect(productData.category).toBe('smartphones'); // Memeriksa apakah kategori produk adalah 'smartphones'
    expect(productData.brand).toBe('Apple'); // Memeriksa apakah merek produk adalah 'Apple'
    expect(productData.rating).toBeCloseTo(4.69, 2); // Memeriksa apakah peringkat produk mendekati 4.69 dengan tepat dua desimal
    expect(productData.stock).toBeGreaterThan(0); // Memeriksa apakah stok produk lebih besar dari 0
  });

  // fetchProductsData Test Case 2
  test('should check products.length with limit', async () => {
    const productData = await fetchProductsData();
    expect(Array.isArray(productData.products)).toBe(true); // Memeriksa apakah produk adalah array
    expect(productData.products.length).toBeLessThanOrEqual(productData.total);  // Memeriksa apakah panjang produk tidak melebihi total produk yang tersedia
    expect(productData.products.length).toBeLessThanOrEqual(30); // Memeriksa apakah panjang produk tidak melebihi 30
  });

  // fetchProductsData Test Case 3
  test('should return product data with id 3', async () => {
    const productId = 3;
    const productData = await fetchProductsData(productId);
    expect(productData).toBeDefined(); // Memeriksa apakah data produk terdefinisi
    expect(productData.id).toBe(productId); // Memeriksa apakah ID produk sesuai dengan yang diharapkan (3)
    expect(productData.title).toBe('Samsung Universe 9'); // Memeriksa apakah judul produk adalah 'Samsung Universe 9'
    expect(productData.price).toBeGreaterThan(0); // Memeriksa apakah harga produk lebih besar dari 0
    expect(productData.category).toBe('smartphones'); // Memeriksa apakah kategori produk adalah 'smartphones'
    expect(productData.brand).toBe('Samsung'); // Memeriksa apakah merek produk adalah 'Samsung'
    expect(productData.rating).toBeCloseTo(4.09, 2); // Memeriksa apakah peringkat produk mendekati 4.09 dengan tepat dua desimal
    expect(productData.stock).toBeGreaterThan(0); // Memeriksa apakah stok produk lebih besar dari 0
  });

  // fetchProductsData Test Case 4
  test('should validate product thumbnails', async () => {
    const productData = await fetchProductsData();
    expect(Array.isArray(productData.products)).toBe(true); // Memeriksa apakah produk adalah array
    expect(productData.products.length).toBeGreaterThan(0); // Memeriksa apakah panjang produk lebih besar dari 0

    productData.products.forEach((product) => {
      expect(product.thumbnail).toBeDefined(); // Memeriksa apakah thumbnail produk terdefinisi
      expect(product.thumbnail).toMatch(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i); // Memeriksa apakah thumbnail produk adalah URL gambar yang valid
    });
  });

});


// Cart API Testing
const { fetchCartsData } = require('../src/dataService');
jest.mock('../src/dataService', () => {
  const originalModule = jest.requireActual('../src/dataService');
  return {
    __esModule: true,
    ...originalModule,
    fetchCartsData: jest.fn(),
  };
});

describe('Cart API Testing', () => {
  // fetchCartsData Test Case 1
  test('should compare total cart items with length of fetched data', async () => {
    // Mocking fetchCartsData untuk mengembalikan data dummy
    fetchCartsData.mockResolvedValue(cartData.carts);

    // Memanggil fetchCartsData dan mendapatkan hasilnya
    const cartsData = await fetchCartsData();

    // Membandingkan panjang data carts dengan total
    const totalItems = cartsData.length;
    const expectedTotal = cartData.total;
    expect(totalItems).toBe(expectedTotal); // Memeriksa apakah jumlah item dalam keranjang sesuai dengan panjang data yang diharapkan
  });

  // fetchCartsData Test Case 2
  test('should validate properties of each product in the cart', async () => {
    fetchCartsData.mockResolvedValue(cartData.carts);

    const cartsData = await fetchCartsData();

    // Memeriksa properti yang diperlukan untuk setiap produk dalam keranjang
    cartsData.forEach((cart) => {
      cart.products.forEach((product) => {
        expect(product).toHaveProperty('id'); // Memeriksa apakah setiap produk memiliki properti 'id'
        expect(product).toHaveProperty('title'); // Memeriksa apakah setiap produk memiliki properti 'title'
        expect(product).toHaveProperty('price'); // Memeriksa apakah setiap produk memiliki properti 'price'
        expect(product).toHaveProperty('quantity'); // Memeriksa apakah setiap produk memiliki properti 'quantity'
        expect(product).toHaveProperty('thumbnail'); // Memeriksa apakah setiap produk memiliki properti 'thumbnail'
      });
    });
  });

  // fetchCartsData Test Case 3
  test('should validate total price calculation of each cart', async () => {
    fetchCartsData.mockResolvedValue(cartData.carts);

    const cartsData = await fetchCartsData();

    cartsData.forEach((cart) => {
      let totalPrice = 0;
      cart.products.forEach((product) => {
        totalPrice += product.price * product.quantity;
      });
      expect(cart.total).toBe(totalPrice); // Memeriksa apakah perhitungan total harga setiap keranjang sesuai dengan yang diharapkan
    });
  });

});


// Product Utility Testing
describe('Product Utility Testing', () => {
  let productsData = []; // Variabel untuk menyimpan data produk

  // Setup: Mengambil data produk dari API
  beforeAll(async () => {
    // Mengambil data produk dari API menggunakan fetchProductsData
    productsData = await fetchProductsData();
  });

  describe('convertToRupiah function', () => {
    // convertToRupiah Test Case 1
    test('should convert 100 dollars into rupiah', () => {
      const priceInRupiah = convertToRupiah(100);
      expect(priceInRupiah).toMatch(/Rp\s1\.543\.600,\d{2}/); // Menggunakan toMatch dengan pola regex
      expect(typeof priceInRupiah).toBe('string'); // Memeriksa apakah hasil adalah string menggunakan typeof
      expect(priceInRupiah).toContain('Rp'); // Memeriksa apakah hasil mengandung 'Rp'
      expect(priceInRupiah).toHaveLength(15); // Memeriksa panjang string hasil
    });

    // convertToRupiah Test Case 2
    test('should convert 250 dollars into rupiah', () => {
      const priceInRupiah = convertToRupiah(250);
      expect(priceInRupiah).toMatch(/Rp\s3\.859\.000,\d{2}/); // Menggunakan toMatch dengan pola regex
      expect(typeof priceInRupiah).toBe('string'); // Memeriksa apakah hasil adalah string menggunakan typeof
      expect(priceInRupiah).toContain('Rp'); // Memeriksa apakah hasil mengandung 'Rp'
      expect(priceInRupiah).toHaveLength(15); // Memeriksa panjang string hasil
    });

    // convertToRupiah Test Case 3
    test('convertToRupiah should handle zero price', () => {
      const priceInRupiah = convertToRupiah(0);
      expect(priceInRupiah).toMatch(/Rp\s0,\d{2}/); // Menggunakan toMatch dengan pola regex
      expect(typeof priceInRupiah).toBe('string'); // Memeriksa apakah hasil adalah string menggunakan typeof
      expect(priceInRupiah).toContain('Rp'); // Memeriksa apakah hasil mengandung 'Rp'
      expect(priceInRupiah).toHaveLength(7); // Memeriksa panjang string hasil
    });

    // convertToRupiah Test Case 4
    test('should handle non-numeric input for convertToRupiah', () => {
      const priceInRupiah = convertToRupiah('abc'); // Parameter bukan angka
      expect(priceInRupiah).toBe('RpNaN'); // Memeriksa kembalian jika input bukan angka
      expect(typeof priceInRupiah).toBe('string'); // Memeriksa apakah hasil adalah string menggunakan typeof
      expect(priceInRupiah).toContain('Rp'); // Memeriksa apakah hasil mengandung 'Rp'
      expect(priceInRupiah).toHaveLength(5); // Memeriksa panjang string hasil
    });
  })

  describe('countDiscount function', () => {
    // countDiscount Test Case 1
    test('countDiscount calculates discount correctly', () => {
      const discountedPrice = countDiscount(200, 10);
      expect(discountedPrice).toBe(180); // Menambahkan test case untuk countDiscount
      expect(typeof discountedPrice).toBe('number'); // Memeriksa apakah hasil adalah tipe data number
      expect(discountedPrice).not.toBeNaN(); // Memastikan hasil tidak NaN
    });

    // countDiscount Test Case 2
    test('should return zero discount for zero price', () => {
      const discountedPrice = countDiscount(0, 20);
      expect(discountedPrice).toBe(0); // Jika harga produk adalah nol, diskonnya juga nol
      expect(typeof discountedPrice).toBe('number'); // Memeriksa apakah hasil adalah tipe data number
      expect(discountedPrice).not.toBeNaN(); // Memastikan hasil tidak NaN
    });

    // countDiscount Test Case 3
    test('should handle zero percentage discount', () => {
      const discountedPrice = countDiscount(100, 0);
      expect(discountedPrice).toBe(100); // Jika diskonnya nol persen, harga harus tetap sama
      expect(typeof discountedPrice).toBe('number'); // Memeriksa apakah hasil adalah tipe data number
      expect(discountedPrice).not.toBeNaN(); // Memastikan hasil tidak NaN
    });

    // countDiscount Test Case 4
    test('should return correct discounted price for large amount with small percentage', () => {
      const discountedPrice = countDiscount(1000, 1);
      expect(discountedPrice).toBe(990); // Jika diskonnya sangat kecil, periksa hasil perhitungan diskon
      expect(typeof discountedPrice).toBe('number'); // Memeriksa apakah hasil adalah tipe data number
      expect(discountedPrice).not.toBeNaN(); // Memastikan hasil tidak NaN
    });

    // countDiscount Test Case 5
    test('should calculate discount correctly for decimal percentage', () => {
      const discountedPrice = countDiscount(300, 7.5);
      expect(discountedPrice).toBe(277.5); // Diskon dengan persentase desimal
      expect(typeof discountedPrice).toBe('number'); // Memeriksa apakah hasil adalah tipe data number
      expect(discountedPrice).not.toBeNaN(); // Memastikan hasil tidak NaN
    });

    // countDiscount Test Case 6
    test('should handle negative price', () => {
      const discountedPrice = countDiscount(-50, 15);
      expect(discountedPrice).toBe(-42.5); // Handle harga negatif dengan diskon
      expect(typeof discountedPrice).toBe('number'); // Memeriksa apakah hasil adalah tipe data number
      expect(discountedPrice).not.toBeNaN(); // Memastikan hasil tidak NaN
    });
  })

  describe('setProductsCards function', () => {
    // setProductsCards Test Case 1
    test('should return correct product card object structure', () => {
      const productCards = setProductsCards(productsData.products);
      // Memeriksa apakah hasil dari setProductsCards memiliki panjang yang sesuai
      expect(productCards).toHaveLength(productsData.products.length);

      // Memeriksa apakah setiap card produk memiliki properti yang diharapkan
      productCards.forEach((productCard) => {
        expect(productCard).toHaveProperty('price'); // Memeriksa apakah productCard produk memiliki properti 'price'
        expect(productCard).toHaveProperty('after_discount'); // Memeriksa apakah productCard produk memiliki properti 'after_discount'
        expect(productCard).toHaveProperty('image'); // Memeriksa apakah productCard produk memiliki properti 'image'
      });
    });

    // setProductsCards Test Case 2
    test('should correctly calculate price and discount for each product', () => {
      const productCards = setProductsCards(productsData.products);

      // Memeriksa apakah harga dan diskon dihitung dengan benar untuk setiap produk
      productCards.forEach((productCard, index) => {
        const product = productsData.products[index];
        const expectedPrice = convertToRupiah(product.price);
        const expectedDiscount = countDiscount(product.price, product.discountPercentage);

        expect(productCard.price).toBe(expectedPrice); // Membandingkan harga yang diharapkan dengan harga aktual
        expect(productCard.after_discount).toBe(expectedDiscount); // Membandingkan diskon yang diharapkan dengan diskon aktual
      });
    });

  });

});


// Asyncronous Testing
// https://jestjs.io/docs/asynchronous


// Mocking
// https://jestjs.io/docs/mock-functions


// Setup & Teardown
// https://jestjs.io/docs/setup-teardown
