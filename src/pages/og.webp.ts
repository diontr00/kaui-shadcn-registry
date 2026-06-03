import { generateOpenGraphImage } from "../lib/generateOpenGraphImage";

export function GET() {
  return generateOpenGraphImage({
    title: "KaUI Shadcn Registry",
    tags: ["Accessible", "Shadcn Native Feel", "Type Safe"],
    secondaryText: "Collection of Personal Shadcn Components",
  });
}
