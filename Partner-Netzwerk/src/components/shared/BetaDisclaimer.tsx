import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";

export const BetaDisclaimer = () => {

    return (
        <div>
            <Dialog>
                <DialogTrigger className="text-left pl-2 text-ecurie-babyblue">
                    <Button className="shad-button_primary font-Univers_LT_Std_57">
                        Beta Disclaimer
                    </Button>
                </DialogTrigger>
                <DialogContent className="border-2 text-light-1 ">
                    <DialogHeader>
                        <DialogTitle>Dies ist eine Beta Test Version des Partnernetzwerks. Hierfür haben wir die maximale Dateigröße für den Upload auf 5MB festgelegt, um die Auslastung zu testen. Sollten Fehler auftreten oder sollten Sie Vorschläge zur Verbesserung haben, dann wenden sie sich bitte an Ihre Praktikanten des Vertrauens:</DialogTitle>
                        <DialogDescription>
                            <div className="flex gap-2 pt-1">
                                <img
                                    src={"/assets/icons/mail-icon-white.svg"}
                                    alt="edit"
                                    width={20}
                                    height={20}
                                />
                                <p className="pt-2">@moritz.langenhan@rwth-aachen.de, @linus.holtkamp@rwth-aachen.de</p>
                            </div>
                            <div className="flex gap-2 pt-1">
                                <img
                                    src={"/assets/icons/slack-new-logo.svg"}
                                    alt="edit"
                                    width={20}
                                    height={20}
                                />
                                <p className="pt-2">@MLAN, @LHOL</p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BetaDisclaimer;