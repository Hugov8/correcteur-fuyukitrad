import useDrivePicker from "react-google-drive-picker";
import { getPickerInfos } from "../calls/authService";
import { Boutton } from "./Boutton";

export const GooglePicker = ({setUrl, setSheetName}: {setUrl: (s: string) => void, setSheetName: (s: string) => void}) => {
    const [openPicker] = useDrivePicker();

    const handleOpenPicker = () => {
    gapi.load('client:auth2', () => {
      getPickerInfos().then( (pickerInfo) => {
            gapi.client.init({apiKey: pickerInfo.apiKey,})
            return pickerInfo
        }).then((pickerInfos) => {
          const pickerConfig: any = {
            clientId: pickerInfos.clientId,
            developerKey: pickerInfos.apiKey,
            viewId: 'SPREADSHEETS',
            token: pickerInfos.token,
            showUploadView: false,
            showUploadFolders: false,
            supportDrives: true,
            multiselect: false,
            callbackFunction: (data: any) => {
              const elements = Array.from(
                document.getElementsByClassName(
                  'picker-dialog'
                ) as HTMLCollectionOf<HTMLElement>
              );
              for (let i = 0; i < elements.length; i++) {
                elements[i].style.zIndex = '2000';
              }
              if (data.action === 'picked') {
                setUrl(data.docs[0].url);
                setSheetName(data.docs[0].name)
              }
            },
          };
          openPicker(pickerConfig);
        });
    });
  };

    return <div>
        <Boutton text="Choisir un fichier" onClick={() => handleOpenPicker()} />
    </div>
    
}