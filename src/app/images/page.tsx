import Image from "next/image";
import sample from "./imported.png";
export default function Images(){return <main><h1>Image acceptance</h1><Image src="/sample.png" alt="Public image" width={256} height={128}/><Image src={sample} alt="Imported image" width={128}/></main>}
