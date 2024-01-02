import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../services/product.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {product} from "../model/product.model";

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit {
  productId! : number;
  productFormGroup! : FormGroup;
  constructor(private activatedRoute : ActivatedRoute,
              private  productService : ProductService,
              private formBuilder: FormBuilder
              ) {
  }
  ngOnInit() {
     this.productId = this.activatedRoute.snapshot.params['id'];
     this.productService.getProductById(this.productId).subscribe({
         next : (product) =>{
           this.productFormGroup= this.formBuilder.group({
             id : this.formBuilder.control(product.id),
             name : this.formBuilder.control(product.name,[Validators.required]),
             price : this.formBuilder.control(product.price,[Validators.min(100)]),
             checked : this.formBuilder.control(product.checked)
           })
         },
       error : error  => {
          console.log(error);
    }
     });
  }

  updateProduct() {
    let product: product = this.productFormGroup.value;
    this.productService.updateProduct(product).subscribe({
      next : data => {
        alert(JSON.stringify(data));
      }
    });
  }
}
