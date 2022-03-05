import React, { useState, useEffect } from 'react';
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router";
import firebase from 'firebase/compat/app';
import settings from "../config/settings";
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { textAlign } from "@mui/system";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const userText = {
  color: "#fff",
  fontSize: "1.2em",
  marginRight: "20px",
  whiteSpace: "nowrap"
}
const userTextbottom = {
  display: "block",
  color: "rgb(143, 222, 253)",
  textTransform: "uppercase",
  fontSize: "0.8em",
  textAlign: "center",
  fontWeight: "bold"
}
const edit={
  position: "absolute",
zIndex: 5,
top: "30px",
right: "-5px",
background:"#fff",
borderRadius: "20px",
width: "25px", height: "25px",
textAlign:"center",
boxShadow: "0px 0px 10px #000",

}
const toast_options = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};



const TheHeaderDropdown = () => {
  const [Isloader, setIsloader] = useState(false);
  const history = useHistory();
  const [image, setImage] = useState("");
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  useEffect(() => {

    let userImg = localStorage.getItem('image')
    console.log("sidebar useEffect", userImg)
    if(userImg){
      setImage(userImg)
    }
    
}, [])
  const onFileChange = (event) => {
    if (event.target.files) {
      const { files } = event.target;
      if (files && files.length > 0) {
        getBase64(files[0]).then((res) => {
          console.log((files[0].size/1024/1024).toFixed(2),'image size');
          if((files[0].size/1024/1024).toFixed(2)<2){
          setImage(res);
          ChangeProfile(res);
          }
          else{
            toast.error("Image size should be less than 2 mb .", toast_options);
          }
        });
      }
    }
  };

  const ChangeProfile = (base64Data) => {
    setIsloader(true)

    let userId = localStorage.getItem('userId')
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
      // reqFrom: "ADMIN",
    };
    let RequestBody = {userPicData: base64Data, userId:userId}
    console.log("RequestBody for profile update:::",RequestBody)
    axios({
      method: "POST",
      url: settings.serverUrl + "/updateUserPic",
      headers,
      data: JSON.stringify(RequestBody),
    }).then((response) => {
      // setImage(base64Data);
      if (response.data.err) {
        // alert(response.data.err);
        toast.error(response.data.err, toast_options);
      }else{
        localStorage.setItem('image', base64Data)

        toast.success(response.data.err, toast_options);
      }
      setIsloader(false)
    });
  };
  return (
    <CDropdown inNav className="c-header-nav-items mx-3" direction="down">
      <div style={{position:"relative"}}>
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div style={userText}>{localStorage.getItem('name')} <span style={userTextbottom}>{localStorage.getItem('company')}</span></div>
  
        <div className="c-avatar">
          <CImg
            src={image ? image : "../avatars/8.jpg"}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
            style={{ width: "50px", height: "50px" }}
          />
          
        </div>
        
      </CDropdownToggle>

      <div style={edit}>
      <i class="fa fa-pencil" aria-hidden="true" style={{position: "absolute", left: 7, top: 5}}></i>

           <input type="file" style={{width: "25px", height: "25px", opacity:"0", cursor:"pointer"}} 
           accept="image/png, image/gif, image/jpeg"
        onChange={(e) => {
          onFileChange(e);
        }}/>
           </div> 
           </div>

      <CDropdownMenu className="pt-0" placement="bottom-end">

        <CDropdownItem divider />
        <CDropdownItem
          onClick={() => {
            // firebase.auth().signOut();
            // history.push("/");
            console.log('handleLogout', history);
            localStorage.clear();
            history.push("/");

          }}
        >
          <CIcon name="cil-lock-locked" className="mfe-2" />
          {/* Lock Account */}
          Sign Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdown;
