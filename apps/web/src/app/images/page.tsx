import { label } from "@arvumi-fixture/shared";
import Image from "next/image";
import sample from "./imported.png";
export default function Images(){return <main><h1>Image acceptance</h1><p id="workspace-label">{label}</p><Image src="/sample.png" alt="Public image" width={256} height={128}/><Image src={sample} alt="Imported image" width={128}/><Image src="https://raw.githubusercontent.com/AnthonyTornetta/hermes-integration-test/7e3748b54b6bdc9f28f657b04e4eba8219ca3b02/public/sample.png" alt="Remote image" width={256} height={128}/></main>}
