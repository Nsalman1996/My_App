import { ProfileController } from "./profile.controller";

export class Controller {
    getController(): Array<any> {
            return [
                new ProfileController()
            ]
    }
}