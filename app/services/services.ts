import { IWikipediaService, WikipediaService } from "services/wikipedia";

export interface IServices {
    readonly wikipedia: IWikipediaService;
}

export default function createServices(): IServices {
    return { wikipedia: new WikipediaService()};
}