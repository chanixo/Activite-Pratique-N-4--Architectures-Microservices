import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {update} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";
import {ProductService} from "../services/product.service";
import {product} from "../model/product.model";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AppStateService} from "../services/app-state.service";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent  implements  OnInit {
  public products : Array<product>=[];
  public keyword : string="";
  totalPages:number=0;
  pageSize:number=3;
  currentPage:number=1;


  constructor(private productService:ProductService,
              private  router : Router,public appState : AppStateService) {
  }
  ngOnInit() {
       this.searchProducts();
  }

  searchProducts(){
   /* this.appState.setProductState({
      status : "LOADING"
    });*/
    this.productService.searchProducts( this.appState.productsState.keyword,this.appState.productsState.currentPage,this.appState.productsState.pageSize)
      .subscribe({
        next : (resp) =>  {
          let products=resp.body as product[];
          let totalProducts : number=parseInt(resp.headers.get('x-total-count')!);
         // this.appState.productsState.totalProducts=totalProducts;
          let totalPages =
            Math.floor(totalProducts / this.appState.productsState.pageSize);
            if (totalProducts %  this.pageSize !=0 ){
              ++totalPages ;
            }
            this.appState.setProductState({
             products : products,
              totalProducts : totalProducts,
              totalPages : totalPages,
              status : "LOADED"
            })

        },
        error : err =>  {
          this.appState.setProductState({
            status : "ERROR",
            errorMessage : err
          })
        }
      })
    //this.products$=this.productService.getProducts();
  }


  handleCheckProduct(product: product) {
    this.productService.checkProduct(product).subscribe({
      next : updatedProduct => {
        //this.getProducts();
        product.checked=!product.checked;
      }
    })
  }

  handleDelete(product: product) {
    if (confirm("Etes vous sùre ?"))
    this.productService.deleteProduct(product).subscribe({
      next : value => {
      //  this.getProducts();
       //this.appState.productsState.products=
         //this.appState.productsState.products.filter((p:any)=>p.id!=product.id);
        this.searchProducts();
      }
    })
  }


  handleGotoPage(page: number) {

    this.appState.productsState.currentPage=page;
    this.searchProducts();
  }

  handleUpdate(product: product) {
    this.router.navigateByUrl(`/admin/updateProduct/${product.id}`)
  }
}
