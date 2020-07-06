import React, { Component } from 'react'
import {storeProducts,detailProduct} from './data';

const ProductContext= React.createContext();
//Provider
//Consumer

class ProductProvider extends Component {
    state={
        products:[],
        detailProduct: detailProduct,
        cart:[],
        modalOpen: false,
        modalProduct:detailProduct,
        cartSubtotal: 0,
        cartTax:0,
        cartTotal:0
    };
    componentDidMount(){
        this.setProducts();
    };

    getItem=(id)=>{
        const product= this.state.products.find(item => item.id === id);
        return product;
    };
    openModal=(id)=>{
        const product = this.getItem(id);
        this.setState(()=>{
            return {modalProduct: product, modalOpen: true}
        })
    };
    closeModal=()=>{
        this.setState(()=>{
            return {modalOpen: false}
        })
    };

    setProducts=()=>{
        let tempProduct=[];

        storeProducts.forEach(item=>{
            let singleItem= {...item};
            tempProduct= [...tempProduct,singleItem];
        })
        this.setState(()=>{
            return {products: tempProduct};
        })
    };

    handleDetail=(id)=>{
        const product=this.getItem(id);
        this.setState(()=>{
            return {detailProduct: product};
        })
    };

    addToCart=id=>{
        let tempProducts=[...this.state.products];
        const index= tempProducts.indexOf(this.getItem(id));

        const currentProduct= tempProducts[index];
        currentProduct.inCart= true;
        currentProduct.count= 1;
        const price= currentProduct.price;
        currentProduct.total= price;

        this.setState(()=>{
            return {product: tempProducts, cart: [...this.state.cart,currentProduct] };
        }, 
        ()=> this.addTotal());
    }; 

    increment=id=>{
        let tempCart=[...this.state.cart];
        const selectedProduct= tempCart.find(item=> item.id=== id);
        const index= tempCart.indexOf(selectedProduct);
        const product= tempCart[index];

        product.count =product.count + 1;
        product.total= product.count * product.price;

        this.setState(()=>{return {cart:[...tempCart]};},()=>{this.addTotal()})

    };

    decrement=id=>{
        let tempCart=[...this.state.cart];
        const selectedProduct= tempCart.find(item=> item.id=== id);
        const index= tempCart.indexOf(selectedProduct);
        const product= tempCart[index];

        product.count = product.count -1;
        
        if(product.count === 0){
            this.removeItem(id);
        }else{
            product.total= product.count * product.price;
            this.setState(()=>{return {cart:[...tempCart]}},()=>{this.addTotal()})
        }

    };
    removeItem=id=>{
        let tempProduct = [...this.state.products];
        let tempCart=[...this.state.cart];

        tempCart= tempCart.filter(item=>item.id!==id);
        const index= tempProduct.indexOf(this.getItem(id));
        let removedProduct= tempProduct[index];
        removedProduct.inCart=false;
        removedProduct.count=0;
        removedProduct.total=0;

        this.setState(()=>{
            return{
                cart: [...tempCart],
                products:[...tempProduct],
            }
        },()=>{
            this.addTotal();
        })
    };
    
    clearCart=()=>{
        this.setState(()=>{return {cart:[]}},
        ()=>{this.setProducts(); this.addTotal();}
    )
    }

    addTotal=()=>{
        let subTotal=0;
        this.state.cart.map(item=>{
            return subTotal += item.total;
        });
        const tempTax= subTotal*0.1;
        const tax= parseFloat(tempTax.toFixed(2));
        const total= subTotal+ tax;
        this.setState(()=>{
            return {
                cartSubtotal: subTotal,
                cartTax: tax,
                cartTotal: total
            }
        })

    }
    render() {
        return (
            <ProductContext.Provider value={{
                ...this.state,
                handleDetail: this.handleDetail,
                addToCart: this.addToCart,
                openModal: this.openModal,
                closeModal: this.closeModal,
                increment: this.increment,
                decrement: this.decrement,
                removeItem: this.removeItem,
                clearCart: this.clearCart
            }}>
            {this.props.children} 
            </ProductContext.Provider>
        )
    };
}

const ProductConsumer= ProductContext.Consumer;

export {ProductProvider, ProductConsumer}; 