import { IWikipediaService } from "services/wikipedia";

export interface IServices {
    readonly wikipedia: IWikipediaService;
}