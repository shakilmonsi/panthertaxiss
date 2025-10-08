import Availabestems from "../../../components/ProductsPage/Availabestems";
import ProductsHero from "../../../components/ProductsPage/ProductsHero";
import ProductsHeroMobail from "../../../components/ProductsPage/ProductsHeroMobail";
import RelatedTracks from "../../../components/ProductsPage/Relatedtracks";

const ProductsView = () => {
  return (
    <div
      className="min-h-screen bg-neutral-900 py-10 lg:px-8"
      style={{
        background: "linear-gradient(180deg, #050306 0%, #5D006D 100%)",
      }}
    >
      <div className="hidden lg:block">
        <ProductsHero />
      </div>
      <div className="block lg:hidden">
        <ProductsHeroMobail />
      </div>

      <Availabestems />
      <RelatedTracks />
    </div>
  );
};

export default ProductsView;
