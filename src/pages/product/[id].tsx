import {
  ProductContainer,
  ImageContainer,
  ProductDetails,
} from "@/styles/pages/product";
import { useRouter } from "next/router";

const Product = () => {
  const { query } = useRouter();
  return (
    <ProductContainer>
      <ImageContainer></ImageContainer>
      <ProductDetails>
        <h1>Camiseta X</h1>
        <span>R$ 79,90</span>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Error omnis
          eveniet labore ullam a quo obcaecati, consequuntur hic dignissimos,
          est nobis laboriosam adipisci consequatur, tempore nostrum
          reprehenderit amet suscipit rem!
        </p>

        <button>Comprar agora</button>
      </ProductDetails>
    </ProductContainer>
  );
};

export default Product;
