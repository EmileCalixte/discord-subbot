import {say} from "./SomeModule";
import * as path from "path";

const message: string = "Hello world";

console.log(path.resolve("."));

say(message);
