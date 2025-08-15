import { sendEmailVerification, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { LocationState } from "../slice/location";
import { setUser } from "../slice/user";
import { store } from "../store";
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, query, where, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";


const getCurrentDateTime = () => {
    const now = new Date();

    const year = now.getFullYear(); // Retrieves the full year (e.g., 2024)
    const month = now.getMonth() + 1; // Retrieves the month (0-11), adding 1 to make it 1-12
    const date = now.getDate(); // Retrieves the day of the month (1-31)
    const hours = now.getHours(); // Retrieves the hour (0-23)
    const minutes = now.getMinutes(); // Retrieves the minutes (0-59)
    const seconds = now.getSeconds(); // Retrieves the seconds (0-59)

    // Formatting the date and time as strings
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return {
        year,
        month,
        date,
        time: formattedTime,
        formattedDateTime: `${formattedDate} ${formattedTime}`
    };
}

const splitFullNameBySpace = (name: any) => {
    const names: string[] = name.split(' ')
    return names
}
// const {city, countryName} = useLocation()

const getFirstInitials = (array: string[]) => {
    const firstInitials = array[0][0].toLocaleUpperCase();
    const secondInitials = array[1][0].toLocaleUpperCase();
    const initials = [firstInitials, secondInitials]
    return initials
}

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

interface FirebaseProviderData {
    providerId: string | null;
    uid: string | null;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
}

export class AuthService {
    async handleGoogleSignin() {
        const currentDateTime = getCurrentDateTime();
        const signInData = signInWithPopup(auth, provider).then(async (res: { user: { refreshToken: string; providerData: { photoURL: any; }[]; uid: any; }; }) => {
            const providerData = res.user.providerData[0] as FirebaseProviderData;
            // const newDocRef = push(ref(db, `users`));
            const userDocRef = doc(collection(db, "nerveaccount"), res.user.uid);
            

            const gottenNames: string[] = splitFullNameBySpace(providerData.displayName);
            const allInitials: string[] = getFirstInitials(gottenNames);
            // const user = res.user;
            // await updateProfile(user, {
            //     displayName: `${userData.firstName} ${userData.lastName}`,
            // });
            // Writting user data to the database
           
            const nerveAccount = {
                user: {
                    primaryInformation: {
                        firstName: capitalizeFirstLetter(gottenNames[0]),
                        lastName: capitalizeFirstLetter(gottenNames[1]),
                        middleName: "",
                        email: providerData.email,
                        phone: "",
                        userType: "user",
                        nameInitials: `${allInitials[0].toUpperCase()}${allInitials[1].toUpperCase()}`,
                        uniqueIdentifier: res.user.uid,
                        gender: "",
                        dateOfBirth: "",
                        photoUrl: providerData.photoURL,
                        isLoggedIn: true,
                        agreedToTerms: true,
                        disability: false,
                        disabilityType: "",
                        educationalLevel: "",
                        referralName: "",
                        secondaryEmail: "",
                        securityQuestion: "",
                        securityAnswer: "",
                        verifiedEmail: false,
                        verifyPhoneNumber: false,
                        twoFactorSettings: false,
                        streetNumber: "",
                        streetName: "",
                        city: "",
                        state: "",
                        country: "",
                        dateOfCreation: currentDateTime
                    },
                    // location: {
                    //     locationFromDevice: locationData,
                    //     currentdateTime: currentDateTime,
                    // },
                }
                // payslips: {
                //     paySlip: []
                // },
            };

            await setDoc(userDocRef, nerveAccount);
            const userSnapshot = await getDoc(userDocRef);

            if (userSnapshot.exists()) {
                const fetchedUserData = userSnapshot.data();
                const primaryInformation = fetchedUserData.user.primaryInformation;

                store.dispatch(setUser({
                    providerId: providerData.providerId,
                    uid: providerData.uid,
                    firstName: gottenNames[0],
                    lastName: gottenNames[1],
                    email: providerData.email,
                    phoneNumber: providerData.phoneNumber,
                    photoURL: providerData.photoURL
                }))

                // await sendEmailVerification(user);
                // await signOut(auth); // Prevent implicit navigation

                toast.success(`Your D'roid Account has been successfully created`, {
                    style: { background: "#4BB543", color: "#fff" },
                });

                return { success: true };
            } else {
                toast.error("User Information does not exist 🚫", {
                    style: { background: "#ff4d4f", color: "#fff" },
                });
                return null;
            }
            
        }).catch((err) => {
            console.error("Error during registration:", err);
            toast.error(`Error creating your D'roid Account 🚫`, {
                style: { background: "#ff4d4f", color: "#fff" },
            });
            return null;
        })
        return signInData
    }
}

export const authService = new AuthService()