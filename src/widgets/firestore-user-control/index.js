import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css'

import 'components/modal-dialog';
import { WontonMixin } from 'components/mixins/wonton';
import { mix } from 'utils/mixins';

import tpl from './template.html';
import './styles.css';

/**
 * User control to login / logout and check out the current user profile.
 */
export class FirestoreUserControl extends mix(HTMLElement).with(WontonMixin) {
    static componentName() {
        return 'wtn-firestore-user-control';
    }
    template() {
        return tpl;
    }
    references() {
        return {
            'userDisplay': '.wtn-firestore-user-control-user',
            'loginBtn': '.wtn-firestore-user-control-login',
            'logoutBtn': '.wtn-firestore-user-control-logout',
            'loginDialog': '.wtn-firestore-user-control-dialog'
        }
    }
    listeners() {
        return {
            'loginBtn': {
                'click': () => {
                    this._ui = this._ui || new firebaseui.auth.AuthUI(firebase.auth());
                    const uiConfig = {
                        autoUpgradeAnonymousUsers: true,
                        callbacks: {
                            signInSuccessWithAuthResult: (authResult) => this.handleAuthResult(authResult),
                            uiShown: () => {
                               this.getRef('loginDialog').show();
                            },
                            signInFailure: (error) => {
                                if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
                                    return Promise.resolve();
                                }
                                return firebase.auth().signInAndRetrieveDataWithCredential(error.credential)
                                        .then((authResult) => this.handleAuthResult(authResult));
                            }
                        },
                        signInFlow: 'popup',
                        signInOptions: [
                            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                            firebase.auth.EmailAuthProvider.PROVIDER_ID
                        ]
                    };
                    this._ui.start('.wtn-firestore-user-control-dialog-body', uiConfig);
                }
            },
            'logoutBtn': {
                'click': () => {
                    firebase.auth().signOut();
                    firebase.auth().signInAnonymously();
                }
            }
        }
    }
    handleAuthResult() {
        this.getRef('loginDialog').hide();
        return false;
    }
    connectedCallback() {
        super.connectedCallback();
        firebase.auth().onAuthStateChanged(user => {
            this._user = user;
            if (this._user && !this._user.isAnonymous) {
                this.getRef('userDisplay').textContent = this._user.displayName;
                this.getRef('loginBtn').style.display = 'none';
                this.getRef('logoutBtn').style.display = 'inline-block';
            } else {
                this.getRef('userDisplay').textContent = 'Guest';
                this.getRef('loginBtn').style.display = 'inline-block';
                this.getRef('logoutBtn').style.display = 'none';
            }
        });
    }
}
customElements.define('wtn-firestore-user-control', FirestoreUserControl);
export default FirestoreUserControl;