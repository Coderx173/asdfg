import { atom } from "recoil";

type selected = string;
export const selectedState = atom<selected>({
	key: "selectedState",
	default: "Status",
});
