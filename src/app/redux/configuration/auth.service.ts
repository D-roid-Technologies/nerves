import { signInWithPopup } from "firebase/auth";
import { get, push, ref, set } from "firebase/database";
import { auth, db, provider } from "../../firebase";
import { LocationState } from "../slice/location";
import { setUser } from "../slice/user";
import { store } from "../store";


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

            // sessionStorage.setItem("accessToken", res.user.refreshToken);
            // const newDocRef = push(ref(db, `users`));

            const gottenNames: string[] = splitFullNameBySpace(providerData.displayName);
            const allInitials: string[] = getFirstInitials(gottenNames);

            store.dispatch(setUser({
                providerId: providerData.providerId,
                uid: providerData.uid,
                firstName: gottenNames[0],
                lastName: gottenNames[1],
                email: providerData.email,
                phoneNumber: providerData.phoneNumber,
                photoURL: providerData.photoURL
            }))
            // Writting user data to the database
            //   set(newDocRef, {
            //     primaryInformation: {
            //       firstName: capitalizeFirstLetter(gottenNames[0]),
            //       lastName: capitalizeFirstLetter(gottenNames[1]),
            //       middleName: "",
            //       email: res.user.providerData[0].email,
            //       phone: "",
            //       userType: "member",
            //       nameInitials: `${allInitials[0].toUpperCase()}${allInitials[1].toUpperCase()}`,
            //       uniqueIdentifier: res.user.uid,
            //       gender: "",
            //       dateOfBirth: "",
            //       disability: false,
            //       disabilityType: "",
            //       loginCount: handleLoginCount(0),
            //       educationalLevel: "",
            //       photoUrl: res.user.providerData[0].photoURL
            //     },
            //     secondaryInformation: {
            //       referralName: "",
            //       secondaryEmail: "",
            //       securityQuestion: "",
            //       securityAnswer: "",
            //     },
            //     userAuthententication: {
            //       isLoggedIn: true,
            //       verifiedEmail: false,
            //       verifyPhoneNumber: false,
            //       agreedToTerms: true,
            //       twoFactorSettings: false,
            //     },
            //     location: {
            //       countrySelected: locationData.principalSubdivision,
            //       countryDetailsFromDevice: locationData,
            //       currentdateTime: currentDateTime,
            //     },
            //     kCoin: {
            //       amount: 0,
            //       storeCardDetails: false,
            //       mineCoins: {
            //         numberOfReferals: 0,
            //         numberOfAdsWatched: 0
            //       }
            //     },
            //     courses: AllCourses,
            //     notifications: AllNotifications,
            //     schedules: AllSchedles,
            //     diaries: [
            //       {
            //         diaryTitle: "The Diary Platform",
            //         description: "Tell us your thoughts",
            //         startDate: currentDateTime.formattedDateTime,
            //         endDate: addDaysToDate(currentDateTime.formattedDateTime, 30),
            //       }
            //     ],
            //     lunchBox: {
            //       events: [
            //         {
            //           eventTitle: "D'roid Technologies - Chess Marathon",
            //           description: "The Chess Marathon of the year",
            //           imageLink: "",
            //           attendees: 0,
            //           createdTime: currentDateTime.time,
            //           createdDate: `${currentDateTime.date}-${currentDateTime.month}-${currentDateTime.year}`,
            //         }
            //       ],
            //       jobs: [
            //         {
            //           jobTitle: "Front-End Developer - React Js",
            //           description: "We are looking for a front end developer in Recat Js",
            //           imageLink: "",
            //           peopleApplied: 0,
            //           createdTime: currentDateTime.time,
            //           createdDate: `${currentDateTime.date}-${currentDateTime.month}-${currentDateTime.year}`,
            //         }
            //       ]
            //     }
            //   });
            //   store.dispatch(
            //     setAuthData({
            //       uid: newDocRef.key,
            //       accessToken: res.user.refreshToken,
            //     })
            //   );
            // sessionStorage.setItem("accessToken", res.user.refreshToken);
            // const dbRef = ref(db, `users`);
            // const snapShot = await get(dbRef);
            // const objectsOfData: object[] = Object.values(snapShot.val());
            // let userObject: any = getUser(objectsOfData, res.user.uid);
            // console.log("from sign up database", userObject);
            // store.dispatch(
            //     setUserData({
            //         firstName: userObject.primaryInformation.firstName,
            //         lastName: userObject.primaryInformation.lastName,
            //         middleName: userObject.primaryInformation.middleName,
            //         country: userObject.location.country,
            //         phone: userObject.primaryInformation.phone,
            //         verifyPhoneNumber:
            //             userObject.userAuthententication.verifyPhoneNumber,
            //         userType: userObject.primaryInformation.userType,
            //         verifiedEmail: userObject.userAuthententication.verifiedEmail,
            //         agreedToTerms: userObject.userAuthententication.agreedToTerms,
            //         nameInitials: userObject.primaryInformation.nameInitials,
            //         uniqueIdentifier: userObject.primaryInformation.uniqueIdentifier,
            //         gender: userObject.primaryInformation.gender,
            //         dateOfBirth: userObject.primaryInformation.dateOfBirth,
            //         disability: userObject.primaryInformation.disability,
            //         disabilityType: userObject.primaryInformation.disabilityType,
            //         timeZone: userObject.location.timeZone,
            //         educationalLevel: userObject.primaryInformation.educationalLevel,
            //         referralName: userObject.secondaryInformation.referralName,
            //         secondaryEmail: userObject.secondaryInformation.secondaryEmail,
            //         residentialAddress: userObject.location.residentialAddress,
            //         city: userObject.location.city,
            //         state: userObject.location.state,
            //         postalCode: userObject.location.postalCode,
            //         loginCount: userObject.primaryInformation.loginCount,
            //         kCoin: userObject.kCoin.amount,
            //     })
            // );
            // store.dispatch(
            //     addCourses(userObject.courses)
            // );
            // store.dispatch(
            //     addDiaries(userObject.diaries)
            // );
            // store.dispatch(
            //     addLunchBox(userObject.lunchBox)
            // );
            // store.dispatch(
            //     addNotification(userObject.notifications)
            // );
            // store.dispatch(
            //     addSchedule(userObject.schedules)
            // );
        }).catch((err) => {
            console.log(err.message)
        })
        return signInData
    }
}

export const authService = new AuthService()