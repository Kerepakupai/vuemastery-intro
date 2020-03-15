Vue.component('ProductDetails', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul>
            <p>Details:</p>
            <li class="list-disc ml-6" v-for="detail in details">{{ detail }}</li>
        </ul>
    `
})

Vue.component('ProductReview', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <div>
                <p v-if="errors.length">
                    <b>Please correct the following error(s):</b>
                    <ul>
                        <li v-for="error in errors">{{ error }}</li>
                    </ul>
                </p>
            </div>

            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>
            
            <p>
                <label for="review">Review:</label>      
                <textarea id="review" v-model="review"></textarea>
            </p>
            
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
                
            <p>
                <input type="submit" value="Submit">  
            </p>    
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit: function () {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.errors = []
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }
    }
})

Vue.component('Product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="flex flex-wrap p-4">
                <div class="w-3/6">
                    <img class="border border-solid border-gray-300 w-3/5 m-12" :src="image" :alt="altText">
                </div>

                <div class="mt-8 w-3/6">
                    <!-- producto info -->
                    <h1 class="text-2xl">{{ title }}</h1>
                    <a :href="link" target="_blank">Mas productos como este...</a>
                    <p v-if="inStock">In Stock</p>
                    <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
                    <span>{{ sale }}</span>
                    <p>Shipping: {{ shipping }}</p>
                    <product-details :details="details"></product-details>
                    <ul>
                        <p>Sizes:</p>
                        <li class="list-disc ml-6" v-for="size in sizes">{{ size }}</li>
                    </ul>

                    <div class="flex flex-row mb-4">
                        <div 
                            v-for="(variant, index) in variants" 
                            @mouseover="updateProduct(index)"
                            class="w-8 h-8 mt-3 mr-3"
                            :key="variant.variantId"
                            :style="{ backgroundColor: variant.variantColor }"
                            >
                        </div>
                    </div>

                    <div class="flex flex-row">
                        <button 
                            @click="addToCart" 
                            :disabled="!inStock" 
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                            Add to Cart
                        </button>
                        <button @click="removeFromCart" class=" ml-2 bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Remove from Cart</button>
                    </div>
                </div>

                <div class="mt-6">
                    <div>
                        <h2>Reviews</h2>
                        <p v-if="!reviews.length">There are no reviews yet.</p>
                        <ul>
                            <li v-for="review in reviews">
                                <p>{{ review.name }}</p>
                                <p>Rating: {{ review.rating }}</p>
                                <p>{{ review.review }}</p>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="mt-6">
                        <product-review @review-submitted="addReview"></product-review>
                    </div>
                </div>

        </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            description: 'A pair of warm, fuzzy socks',
            selectedVariant: 0,
            altText: 'A pair of warm, fuzzy socks',
            link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
            onSale: true,
            details: ['80% cotton', '20% polyster', 'Gender-neutral'],
            variants: [
                {
                variantId: 2234,
                variantColor: 'green',
                variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
                variantQuantity: 10  
                },
                {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
                variantQuantity: 4
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: []
        }
    },
    methods: {
        addToCart: function () {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct: function (index) {
            this.selectedVariant = index
            console.log(index)
        },
        addReview: function (productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title() {
            return `${this.brand} ${this.product}`
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        }, 
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if (this.onSale) {
                return this.title + ' are on sale!'
            } 
            return  this.title + ' are not on sale'
        },
        shipping() {
            if(this.premium) {
                return 'Free'
            } else {
                return '$2.99'
            } 
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart: function (id) {
            this.cart.push(id)
        },
        removeItems: function (id) {
            for(var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                }
            }
        }
    }
})