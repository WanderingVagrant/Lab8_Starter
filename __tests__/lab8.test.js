describe('Basic user flow for Website', () => {
  // First, visit the lab 8 website
  beforeAll(async () => {
    await page.goto('https://cse110-f2021.github.io/Lab8_Website');
  });

  // Next, check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');
    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });
    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');
    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;
    let data, plainValue;
    // Query select all of the <product-item> elements
    const prodItems = await page.$$('product-item');
    console.log(`Checking product item 1/${prodItems.length}`);
    
    for(var i = 0; i<prodItems.length; i++){
      // Grab the .data property of <product-items> to grab all of the json data stored inside
      data = await prodItems[i].getProperty('data');
      // Convert that property to JSON
      plainValue = await data.jsonValue();
      // Make sure the title, price, and image are populated in the JSON
      if (plainValue.title.length == 0) { allArePopulated = false; }
      if (plainValue.price.length == 0) { allArePopulated = false; }
      if (plainValue.image.length == 0) { allArePopulated = false; }
    }
    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);

  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    const prodItem = await page.$('product-item');
    const root = await prodItem.getProperty('shadowRoot');
    const button = await root.$('button');
    await button.click();
    const text = await button.getProperty('innerText');
    expect(text['_remoteObject'].value).toBe('Remove from Cart');
    

    
  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');
    const prodItems = await page.$$('product-item');
    for(var i = 1; i<prodItems.length; i++){
      const root = await prodItems[i].getProperty('shadowRoot');
      const button = await root.$('button');
      await button.click();
    }
    const cart = await page.$('#cart-count');
    const num = await cart.getProperty('innerText');
    expect(num['_remoteObject'].value).toBe("20");


  }, 10000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    var passed = true;
    await page.reload();
    const prodItems = await page.$$('product-item');    
    for(var i = 0; i<prodItems.length; i++){
      const root = await prodItems[i].getProperty('shadowRoot');
      const button = await root.$('button');
      const text = await button.getProperty('innerText');
      if(text['_remoteObject'].value != 'Remove from Cart'){
        passed = false;
      }
    }
    const cart = await page.$('#cart-count');
    const num = await cart.getProperty('innerText');
    if(num['_remoteObject'].value != "20"){
      passed = false;
    }
    expect(passed).toBe(true);
  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(async () => {
      return await (window.localStorage).getItem('cart');
    })

    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
    
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    const prodItems = await page.$$('product-item');
    for(var i = 0; i<prodItems.length; i++){
      const root = await prodItems[i].getProperty('shadowRoot');
      const button = await root.$('button');
      await button.click();
    }
    const cart = await page.$('#cart-count');
    const num = await cart.getProperty('innerText');
    expect(num['_remoteObject'].value).toBe("0");

  }, 10000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    var passed = true;
    await page.reload();
    const prodItems = await page.$$('product-item');    
    for(var i = 0; i<prodItems.length; i++){
      const root = await prodItems[i].getProperty('shadowRoot');
      const button = await root.$('button');
      const text = await button.getProperty('innerText');
      if(text['_remoteObject'].value != 'Add to Cart'){
        passed = false;
      }
    }
    const cart = await page.$('#cart-count');
    const num = await cart.getProperty('innerText');
    if(num['_remoteObject'].value != "0"){
      passed = false;
    }
    expect(passed).toBe(true);
  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
    const cart = await page.evaluate(async () => {
      return await (window.localStorage).getItem('cart');
    })

    expect(cart).toBe('[]');
    
  });
});