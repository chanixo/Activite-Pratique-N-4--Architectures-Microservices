import { Injectable } from '@angular/core';
import * as http from "http";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {product} from "../model/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private  host : string="http://localhost:8089";

  constructor(private  http: HttpClient) { }
  public searchProducts( keyword:string="",page : number=1, size :number=4) {
    return this.http.get(`${this.host}/products?name_like=${keyword}&_page=${page}&_limit=${size}`, {observe:'response'});
  }
  public checkProduct(product: product):Observable <product>
    {
    return this.http.patch<product>(`${this.host}/products/${product.id}` , {checked:!product.checked});
  }
  public deleteProduct(product: product)
  {
    return this.http.delete<any>(`${this.host}/products/${product.id}` );
  }

  saveProduct(product: product) :Observable<product> {
    return this.http.post<product>(`${this.host}/products/` , product);
  }

  getProductById(productId: number) : Observable<product> {
   return  this.http.get<product>(`${this.host}/products/${productId}`);

  }

  updateProduct(product: product): Observable<product> {
    return  this.http.put<product>(`${this.host}/products/${product.id}`,product);

  }
}
