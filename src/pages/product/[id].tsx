import { stripe } from "@/lib/stripe";
import {
  ProductContainer,
  ImageContainer,
  ProductDetails,
} from "@/styles/pages/product";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Stripe from "stripe";
import Image from "next/image";
import axios from "axios";
import Head from "next/head";

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    defaultPriceId: string;
  };
}

const Product = ({ product }: ProductProps) => {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false);

  // caso queira navegar dentro da nossa pagina vc usa o router
  // const router = useRouter()

  const { isFallback } = useRouter();

  const handleBuyProduct = () => {
    setIsCreatingCheckoutSession(true);

    axios
      .post("/api/checkout", { priceId: product.defaultPriceId })
      .then((response) => {
        const { checkoutUrl } = response.data;

        window.location.href = checkoutUrl;
      })
      .catch((e) => {
        setIsCreatingCheckoutSession(false);
        alert("Falha ao redirecionar ao checkout.");
      });
  };

  if (isFallback) {
    return <p>Loanding...</p>;
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>
      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt="" />
        </ImageContainer>
        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>

          <button
            disabled={isCreatingCheckoutSession}
            onClick={handleBuyProduct}
          >
            Comprar agora
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  );
};

export default Product;

// getStaticPaths eu devo usar sempre q o ssg da pagina pegar um parametro da url ou de qualquer outro lugar

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: "prod_PFrQcez226IfHC" } }],
    fallback: "blocking",
  };
};

// o primeiro argumento no generics é apontando qual o retorno no props, o segundo é direndo oq tem no params onde eu falo que o id é uma string

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  const productId = params!.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ["default_price"],
  });

  const price = product.default_price as Stripe.Price;

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price.unit_amount! / 100),
        description: product.description,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1, //1h
  };
};
