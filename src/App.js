import React from "react";
import axios from "axios";
import {atom,  selector, useRecoilValue, useRecoilState } from "recoil";
import { product} from "prelude-ls"

//cart state with atom
const cartState =atom({
  key: "cartState",
  default: []
});
//total state using selector
const cartTotalState= selector({

  key:"cartToatalState",
  get: ({get}) => {
    const cart =get(cartState);
    const total =cart.reduce((prev, curr)=> prev +curr.price,0);
return{
  total
} 
}
})

//remote api using selector method from recoil
const productsQuery = selector({

  key: "Products", 
  get: async() =>{
    try{
      const res = await axios("https://fakestoreapi.com/products");
      return res.data || [];
    }catch(error){
      console.log(`ERROR: \n${error}`);
      return[];
    }
  }
});


const FakeProducts = (onAddCartItem) =>{

  //list
 const dummyProducts= useRecoilValue(productsQuery);
  return(
    <>
    <div className="l-flex">
      <div className="l-fg3">
        {
          dummyProducts.map((product)=>(
            <div className="card" key={product.id}>
              <img src={product.image} alt=""/>
              <div className="card-body">
                <h2>{product.title}</h2>
                <h5>{product.category}</h5>
                <p>{product.description}</p>
                <h5>(${product.price}) <button onClick={() => onAddCartItem(product)}>Add</button></h5>
              </div>
              </div>
              
          ))
        }
      </div>
    </div>
    
    
    </>
  )
}
const Basket=({products, onRemoveCartItem,total}) => {
  <>
  <div className="title"> your wishlist {!products.length ? "" : products.length}
    </div>
    <div className="basket">
      {
        !products.length
        ? "no items"
        : products.map((product)=>(
          <p key ={product.id}>
          (${product.price})
          <button onClick={()=> onRemoveCartItem(product)}>Remove</button></p>
          
        ))
      }
    </div>
    {!product.length? "" : <div className="total"> TOTAL:${total}</div>}
    </>
}


const App = () =>{
//set cart as usestate
  const[cart,setCart] = useRecoilState(cartState);
//set
const [{total},setTotalFromSelector]=useRecoilState(cartTotalState);

const AddCartItem = (product) => {
  setCart((cart) => {
cart.find((item) => item.id !== product.id)
    ? cart 
    : [...cart, product]
  })
}




  //remove
  const removeCartItem=(product) => {
    setCart((cart) => cart.filter((item) => item.id !== product.id))
  }
return (
  <div>
    <React.Suspense fallback={<div>Loading...</div>}>
    <FakeProducts onAddCartItem={AddCartItem}>

    </FakeProducts>
    </React.Suspense>
    <div className="floatcart">
      <Basket total={total} setCart={setTotalFromSelector} products= {cart} onRemoveCartItem={removeCartItem}/>
    </div>
   

  </div>
)

}
export default App;