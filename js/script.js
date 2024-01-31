function signup(role) {
  let firstName = document.getElementById("firstName").value;
  let verifFirstName = firstName.length >= 3;
  DisplayError(
    verifFirstName,
    "errFirstName",
    "First Name should be at Must 3 char"
  );

  let lastName = document.getElementById("lastName").value;
  let verifLastName = lastName.length >= 3;
  DisplayError(verifLastName, "errLastName", "Last Name be at Must 5 char");

  let tel = document.getElementById("tel").value;
  let verifTel = tel.length == 8 && !isNaN(tel);
  DisplayError(verifTel, "errTel", "tel invalid");

  let email = document.getElementById("email").value;
  let verifEmail = validateEmail(email);
  DisplayError(verifEmail, "errEmail", "email invalid");

  let verifExistEmail = existEmail(email);
  DisplayError(!verifExistEmail, "errEmail", "email Existe");

  let password = document.getElementById("password").value;
  let verifPwd = password.length > 5;
  DisplayError(verifPwd, "errPwd", "Pwd invalid");

  let cPassword = document.getElementById("cpassword").value;
  let verifCPwd = mustMatch(password, cPassword);
  DisplayError(verifCPwd, "errCPwd", "cPwd not match ");

  if (
    verifFirstName &&
    verifLastName &&
    verifTel &&
    verifEmail &&
    verifPwd &&
    verifCPwd &&
    !verifExistEmail
  ) {
    let usersTab = getFromLS("users");
  
    let data = {
      id: generateId(usersTab),
      firstName: firstName,
      lastName: lastName,
      tel: tel,
      email: email,
      password: password,
      role: role,
    };
    usersTab.push(data);
    localStorage.setItem("users", JSON.stringify(usersTab));
    location.replace("login.html");
  }
}




function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let users = getFromLS("users");
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password  ) {
      localStorage.setItem("connectedUser", JSON.stringify(users[i].id));
      if (users[i].role === "admin") {
        location.replace("tableProduct.html");
      } else {
        location.replace("products.html");
      }
      break;
    } else {
      document.getElementById("errLogin").innerHTML = "Not OK";
      document.getElementById("errLogin").style.color = "red";
    }
  }
}

function addProduct() {
  let name = document.getElementById("name").value;
  let price = document.getElementById("price").value;
  let stock = document.getElementById("stock").value;
  let category = document.getElementById("category").value;
  let productsTab = getFromLS("products");

  let data = {
    id: generateId(productsTab),
    name: name,
    price: price,
    stock: stock,
    category: category,
  };
  productsTab.push(data);
  localStorage.setItem("products", JSON.stringify(productsTab));

  // location.replace("tableProduct.html");
}

function editProduct() {
  let name = document.getElementById("name").value;
  let price = document.getElementById("price").value;
  let stock = document.getElementById("stock").value;
  let category = document.getElementById("category").value;
  let idProduct = JSON.parse(localStorage.getItem("reserve"));
  let data = {
    id: idProduct,
    name: name,
    price: price,
    stock: stock,
    category: category,
  };

  updateProduct(data, idProduct);
  location.replace("tableProduct.html");
}

function tableProduct() {
  let innerProduct = ``;
  let products = getFromLS("products");
  for (let i = 0; i < products.length; i++) {
    console.log(typeof products[i].id);
    innerProduct =
      innerProduct +
      ` 
     <tr>
        <th >${products[i].id}</th>
        <td>${products[i].name}</td>
        <td>${products[i].price}  </td>
        <td>${products[i].stock} </td>
        <td>${products[i].category} </td>
       
        <td>
        <button  class="btn btn-outline-danger" onclick="reserveProd(${products[i].id}, '${products[i].name}')"   data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fa fa-trash" aria-hidden="true"></i></button>
      </td>
      <td>
      <button  class="btn btn-outline-info" onclick="navigateTo(${products[i].id}, 'editProduct.html')"><i class="fa fa-pencil" aria-hidden="true"></i></button>
    </td>
     </tr>


  `;
  }
  // onclick="deleteProduct(${products[i].id})"
  document.getElementById("table-Product").innerHTML = innerProduct;
}

function DisplayProduct() {
  let innerProduct = ``;
  let products = getFromLS("products");
  for (let i = 0; i < products.length; i++) {
    innerProduct =
      innerProduct +
      ` 
      <div class="col-lg-3 col-md-6 col-sm-6" >
      <div class="product__item">
          <div class="product__item__pic" style="background-image: url('img/product/product-12.jpg');">
              <ul class="product__item__pic__hover">
                  <li><a onclick="addToWishes(${products[i].id})"><i class="fa fa-heart"></i></a></li>
                  <li><a href="#"><i class="fa fa-retweet"></i></a></li>
                  <li><a onclick="navigateTo(${products[i].id}, 'shop-details.html')" ><i class="fa fa-shopping-cart"></i></a></li>
              </ul>
          </div>
          <div class="product__item__text">
              <h6><a href="#">${products[i].name}</a></h6>
              <h5> ${products[i].price} TND</h5>
          </div>
      </div>
  </div>

  `;
  }
  document.getElementById("display-product").innerHTML = innerProduct;
}

function addToWishes(id) {
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  let wishes = getFromLS("wishes");
  let data = {
    userId: connectedUser,
    products: [id],
  };
  if (wishes.length === 0) {
    wishes.push(data);
  } else {
    let findedUser = false;
    for (let i = 0; i < wishes.length; i++) {
      if (wishes[i].userId === connectedUser) {
        findedUser = true;
        if (!wishes[i].products.includes(id)) {
          wishes[i].products.push(id);
        }
      }
    }
    if (findedUser == false) {
      wishes.push(data);
    }
  }

  localStorage.setItem("wishes", JSON.stringify(wishes));
  displayHeader();
}

function displayDetailProduct() {
  let id = JSON.parse(localStorage.getItem("reserve"));
  let product = getFromLSByKeyAndId("products", id);
  document.getElementById("prName").innerHTML = product.name;
  document.getElementById("prPrice").innerHTML = product.price + " TND";
}

function displayProductToEdit() {
  let productId = getFromLS("reserve");
  let product = getFromLSByKeyAndId("products", productId);

  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.price;
  document.getElementById("stock").value = product.stock;
  document.getElementById("category").value = product.category;
}

function deleteProduct() {
  let id = JSON.parse(localStorage.getItem('idProd'))
  let products = getFromLS("products");
  let pos;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      pos = i;
    }
  }

  products.splice(pos, 1);
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.removeItem('idProd')
  location.reload()

}
function reserveProd(id, prName) {
  localStorage.setItem("idProd", JSON.stringify(id))
  document.getElementById("modal-body").innerHTML = "Are you Sur " + prName

}
function displayHeader() {
  let innerHeader = ``;

  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));

  if (connectedUser !== null) {
    // here into connected user
    let user = getFromLSByKeyAndId("users", connectedUser);
    if (user.role === "admin") {
      // here into connected user role admin

      let wishes = getFromLS("wishes");
      let S = 0;
      for (let i = 0; i < wishes.length; i++) {
        if (wishes[i].userId === connectedUser) {
          S = wishes[i].products.length;
        }
      }
      innerHeader = `     
  <div class="container">
      <div class="row">
          <div class="col-lg-3">
              <div class="header__logo">
                  <a href="./index.html"><img src="img/logo.png" alt=""></a>
              </div>
          </div>
          <div class="col-lg-6">
              <nav class="header__menu">
                  <ul>
                      <li class="active"><a href="./index.html">Home</a></li>
                      <li><a href="./addProduct.html">ADD Product</a></li>
                      <li><a href="./tableProduct.html">Table Product</a></li>
                      <li><a href="./orderTable.html">Orders</a></li>
                      <li><a  onclick="logout()">logOut</a></li>
                  
                      
                  </ul>
              </nav>
          </div>
          <div class="col-lg-3">
              <div class="header__cart">
                  <ul>
                      <li><a href="#"><i class="fa fa-heart"></i> <span>${S}</span></a></li>
                      <li><a href="#"><i class="fa fa-shopping-bag"></i> <span>3</span></a></li>
                  </ul>
                  <div class="header__cart__price">item: <span>$150.00</span></div>
              </div>
          </div>
      </div>
      <div class="humberger__open">
          <i class="fa fa-bars"></i>
      </div>
  </div>  `;
    } else {
      // here into connected user role simple user

      let wishes = getFromLS("wishes");
      let S = 0;
      for (let i = 0; i < wishes.length; i++) {
        if (wishes[i].userId === connectedUser) {
          S = wishes[i].products.length;
        }
      }

      innerHeader = `     
  <div class="container">
      <div class="row">
          <div class="col-lg-3">
              <div class="header__logo">
                  <a href="./index.html"><img src="img/logo.png" alt=""></a>
              </div>
          </div>
          <div class="col-lg-6">
              <nav class="header__menu">
                  <ul>
                      <li class="active"><a href="./index.html">Home</a></li>
                      <li><a href="./products.html">Products</a></li>
                      <li><a href="./orderTable.html">Orders</a></li>
                   
                      <li class="dropdown"><a class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" ><i class="fa fa-user" aria-hidden="true"></i></a>
                      <ul class="dropdown-menu">
                        <li><button class="dropdown-item"  onclick="logout()" type="button">logOut</button></li>
                        <li><a class="dropdown-item"  href="./editProfile.html">edit profil</a></li>
                      </ul>
                      </li>
                      
                  </ul>
              </nav>
          </div>
          <div class="col-lg-3">
              <div class="header__cart">
                  <ul>
                      <li><a href="shoping-cart.html"><i class="fa fa-heart"></i> <span>${S}</span></a></li>
                      <li><a href="#"><i class="fa fa-shopping-bag"></i> <span>3</span></a></li>
                  </ul>
                  <div class="header__cart__price">item: <span>$150.00</span></div>
              </div>
          </div>
      </div>
      <div class="humberger__open">
          <i class="fa fa-bars"></i>
      </div>
  </div>  `;
    }
  } else {
    innerHeader = `     
    <div class="container">
        <div class="row">
            <div class="col-lg-3">
                <div class="header__logo">
                    <a href="./index.html"><img src="img/logo.png" alt=""></a>
                </div>
            </div>
            <div class="col-lg-6">
                <nav class="header__menu">
                    <ul>
                        <li class="active"><a href="./index.html">Home</a></li>
                       
                        <li><a href="./signup.html">Sign up</a></li>
                        <li><a href="./login.html">Login</a></li>
                    </ul>
                </nav>
            </div>
            <div class="col-lg-3">
                <div class="header__cart">
                    <ul>
                        <li><a href="#"><i class="fa fa-heart"></i> <span>1</span></a></li>
                        <li><a href="#"><i class="fa fa-shopping-bag"></i> <span>3</span></a></li>
                    </ul>
                    <div class="header__cart__price">item: <span>$150.00</span></div>
                </div>
            </div>
        </div>
        <div class="humberger__open">
            <i class="fa fa-bars"></i>
        </div>
    </div>  `;
  }
  document.getElementById("header").innerHTML = innerHeader;
}

function displayProductsWishes() {
  let innerProducts = ``;
  let wishes = getFromLS("wishes");
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  for (let i = 0; i < wishes.length; i++) {
    if (wishes[i].userId === connectedUser) {
      for (let j = 0; j < wishes[i].products.length; j++) {
        let product = getFromLSByKeyAndId("products", wishes[i].products[j]);
        innerProducts =
          innerProducts +
          `
      <tr>
      <td class="shoping__cart__item">
          <img src="img/cart/cart-1.jpg" alt="">
          <h5>${product.name}</h5>
      </td>
      <td class="shoping__cart__price">
          ${product.price} DT
      </td>  
      <td class="shoping__cart__item__close">
        <a onclick="deleteWish(${i} , ${j})">  <span class="icon_close"></span> </a>
      </td>
  </tr>
      `;
      }
    }
  }

  document.getElementById("display-wishes").innerHTML = innerProducts;
}

function deleteWish(i, j) {
  let wishes = getFromLS("wishes");
  wishes[i].products.splice(j, 1);
  localStorage.setItem("wishes", JSON.stringify(wishes));
  location.reload();
}

function logout() {
  localStorage.removeItem("connectedUser");
  location.replace("index.html");
}

function addOrder() {
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  let productId = JSON.parse(localStorage.getItem("reserve"));
  let product = getFromLSByKeyAndId("products", productId);
  let qty = document.getElementById("qty").value;
  if (Number(qty) > 0 && Number(qty) <= Number(product.stock)) {
    document.getElementById("msgErr").innerHTML = "";

    // ********** here order start **********
    let orders = getFromLS("orders");
    let data = {
      id: generateId(orders),
      userId: connectedUser,
      productId: productId,
      qty: Number(qty),
      date: Date.now(),
    };
    orders.push(data);
    localStorage.setItem("orders", JSON.stringify(orders));
    // ********** here order end **********

    // ********** here update product start **********
    product.stock = Number(product.stock) - Number(qty);
    updateProduct(product, productId);
    // ********** here update product end **********
  } else {
    let err = `
    <div class="alert alert-danger" role="alert">
         Stock Invalid !
    </div>`;
    document.getElementById("msgErr").innerHTML = err;
  }
}

function tableOrders() {
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  let roleConnectedUser = getFromLSByKeyAndId("users", connectedUser).role;
  let innerOrders = ``;
  let orders = getFromLS("orders");
  roleConnectedUser === "user"
    ? (document.getElementById("disabled-th").style.display = "none")
    : null;
  for (let i = 0; i < orders.length; i++) {
    if (roleConnectedUser == "admin") {
      let product = getFromLSByKeyAndId("products", orders[i].productId);
      let user = getFromLSByKeyAndId("users", orders[i].userId);

      innerOrders =
        innerOrders +
        ` 
     <tr>
      <th >${product.name}</th>
      <td>${user.firstName}  ${user.lastName}</td>
      <td>${orders[i].qty}  </td>
      <td>${moment(orders[i].date).format("DD MM YYYY HH:mm:ss")} </td>
      
     </tr>

`
    } else {
      if (orders[i].userId === connectedUser) {
        let product = getFromLSByKeyAndId("products", orders[i].productId);

        innerOrders =
          innerOrders +
          ` 
        <tr>
        <th >${product.name}</th>
        <td>
        <span class="badge ${orders[i].qty > 1 ? "bg-success" : "bg-warning"
          }">${orders[i].qty}</span>
         
         </td>
        <td>${moment(orders[i].date).format("DD MM YYYY HH:mm:ss")} </td>
        
     </tr>
  
  `;
      }
    }
  }

  document.getElementById("table-Orders").innerHTML = innerOrders;
}

function searchProduct() {
  let innerProduct = ``;
  let search = document.getElementById("search").value;
  let products = getFromLS("products");
  for (let i = 0; i < products.length; i++) {
    if (products[i].name.toLowerCase().includes(search.toLowerCase()) || products[i].price.includes(search)) {
      innerProduct =
        innerProduct +
        ` 
      <div class="col-lg-3 col-md-6 col-sm-6" >
      <div class="product__item">
          <div class="product__item__pic " style="background-image: url('img/product/product-12.jpg');">
              <ul class="product__item__pic__hover">
                  <li><a onclick="addToWishes(${products[i].id})"><i class="fa fa-heart"></i></a></li>
                  <li><a href="#"><i class="fa fa-retweet"></i></a></li>
                  <li><a onclick="navigateTo(${products[i].id}, 'shop-details.html')" ><i class="fa fa-shopping-cart"></i></a></li>
              </ul>
          </div>
          <div class="product__item__text">
              <h6><a href="#">${products[i].name}</a></h6>
              <h5> ${products[i].price} TND</h5>
          </div>
      </div>
  </div>

  `;
    }
  }

  document.getElementById("display-product").innerHTML = innerProduct;
}
function displayDataUser() {
  let connectedUser = JSON.parse(localStorage.getItem('connectedUser'))
  let user = getFromLSByKeyAndId("users", connectedUser)
  document.getElementById('firstName').value = user.firstName
  document.getElementById('lastName').value = user.lastName

}

function editProfile() {
  let connectedUser = JSON.parse(localStorage.getItem('connectedUser'))
  let user = getFromLSByKeyAndId("users", connectedUser)
  let FN = document.getElementById('firstName').value
  let LN = document.getElementById('lastName').value
  let PWD = document.getElementById('password').value
  if (mustMatch(PWD, user.password)) {
    console.log("rani dkhalet f weset l condition");

    user.firstName = FN
    user.lastName = LN
    let users = getFromLS('users')

    for (let i = 0; i < users.length; i++) {
      if (users[i].id === connectedUser) {
        users.splice(i, 1, user)

      }
    }

    localStorage.setItem('users',JSON.stringify(users))
  }else{
    let err = `
    <div class="alert alert-danger" role="alert">
         pwd Invalid !
    </div>`;
    document.getElementById("msgErr").innerHTML = err;
  }
}
// ******** Génerique Functions Start******

function DisplayError(verif, id, msgErr) {
  if (verif) {
    document.getElementById(id).innerHTML = "";
  } else {
    document.getElementById(id).innerHTML = msgErr;
  }
}

function validateEmail(email) {
  const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  return re.test(email);
}

function existEmail(email) {
  let existEmail = false;
  let users = getFromLS("users");
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      existEmail = true;
      break;
    }
  }

  return existEmail;
}

function mustMatch(a, b) {
  return a === b;
}

function getFromLS(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function navigateTo(id, path) {
  localStorage.setItem("reserve", JSON.stringify(id));
  location.replace(path);
}

function generateId(T) {
  if (T.length === 0) {
    return 0;
  } else {
    let max = T[0].id;
    for (let i = 0; i < T.length; i++) {
      if (T[i].id > max) {
        max = T[i].id;
      }
    }
    return max + 1;
  }
}

function getFromLSByKeyAndId(key, id) {
  let T = getFromLS(key);
  for (let i = 0; i < T.length; i++) {
    if (T[i].id === id) {
      return T[i];
    }
  }
}

function updateProduct(data, idProduct) {
  let products = getFromLS("products");
  let pos;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === idProduct) {
      pos = i;
    }
  }
  products.splice(pos, 1, data);
  localStorage.setItem("products", JSON.stringify(products));
}

// ******** Génerique Functions End******





















