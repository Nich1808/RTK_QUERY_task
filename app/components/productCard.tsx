import { productResponse } from "@/lip/types/productType";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = productResponse;

const ProductCard = (props: Props) => {
  const {
    images,
    title,
    description,
    price,
    category,
  } = props;

  const imageUrl =
    images?.[0] ??
    "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/e90ccffa-5cde-4a15-8eb1-490519e16aa1/WMNS+AIR+JORDAN+1+RETRO+HI+OG.png";

  return (
    <Card className="relative w-full max-w-sm mx-auto overflow-hidden">
      <div className="absolute inset-0 z-10 bg-black/30" />

      <img
        src={imageUrl}
        alt={title || "product"}
        className="w-full aspect-video object-cover brightness-75"
      />

      <CardHeader>
        <CardTitle>{title ?? "Shoes"}</CardTitle>
        <Badge>{category?.name}</Badge>

        <CardDescription className="line-clamp-2">
          {description ?? "Best shoe in town"}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex items-center justify-between">
        <CardContent className="text-lg font-semibold">
          ${price ?? 100}
        </CardContent>

        <Button>Add To Cart</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;