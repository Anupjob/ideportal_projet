import React from "react";
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
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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

const TheHeaderDropdown = () => {
  const history = useHistory();
  return (
    <CDropdown inNav className="c-header-nav-items mx-3" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div style={userText}>{localStorage.getItem('name')} <span style={userTextbottom}>{localStorage.getItem('company')}</span></div>
        <div className="c-avatar">
          <CImg
            src={"avatars/6.jpg"}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
            style={{ width: "50px", height: "50px" }}
          />
        </div>
      </CDropdownToggle>
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
