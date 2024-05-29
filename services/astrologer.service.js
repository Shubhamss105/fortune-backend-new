import ApiError from "../utils/ApiError.js";
import Astrologer from "../models/adminModel/Astrologer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const getAstrologer = async (title) => {
    try {
        const titleMatch = { "displayName": { "$regex": title, "$options": "i" } };

        const astrologers = await Astrologer.find({
            ...titleMatch,
        });

        return astrologers; 
    } catch (error) {
        throw new ApiError(500, "Internal Server Error - Astrologers Not Fetched");
    }
};

const getAstrologerById = async (id) => {
    try {
        const astrologer = await Astrologer.findOne({ _id: id });
        if (!astrologer) {
            throw new ApiError(404, "Astrologer not found");
        }
        return astrologer;
    } catch (error) {
        throw new ApiError(500, "Internal Server Error - Astrologer Not Fetched");
    }
}

const addNewAstrologer = async (body, files) => {
    const {
        displayName,
        name,
        email,
        password,
        phoneCode,
        phoneNumber,
        gender,
        dateOfBirth,
        experience,
        language,
        address,
        currencyType,
        currencyValue,
        country,
        state,
        city,
        zipCode,
        about,
        educationQualification,
        astrologyQualification,
        follower_count,
        rating,
        bankProofImage,
        bankAcountNumber,
        bankName,
        accountType,
        ifscCode,
        accouuntHolderName,
        addharNumber,
        panNumber,
        chatPrice,
        companyChatPrice,
        callPrice,
        companyCallPrice,
        liveVideoPrice,
        companyLiveVideoPrice,
        liveCallPrice,
        companyLiveCallPrice,
        skill,
        expertise,
        remedies,
        astrologerType,
        status,
    } = body;

    const existingAstrologer = await Astrologer.findOne({ phoneNumber });
    if (existingAstrologer) {
        throw new Error("Astrologer with this phone number already exists.");
    }


    const skillArray = Array.isArray(skill) ? skill : [];
    const remediesArray = Array.isArray(remedies) ? remedies : [];
    const expertiseArray = Array.isArray(expertise) ? expertise : [];
    
    // File upload handling
    const profileImagePath = files.profileImage ? files.profileImage[0].path : "";
    const idProofImagePath = files.idProofImage ? files.idProofImage[0].path : "";
    const galleryImages = files.galleryImage ? files.galleryImage.map(file => file.path) : [];
    // console.log(galleryImages);

    // Handle other file uploads similarly...
    const profileImage = await uploadOnCloudinary(profileImagePath);
    const idProofImage = await uploadOnCloudinary(idProofImagePath);
    const galleryImageUrls = await Promise.all(galleryImages.map(uploadOnCloudinary));
    const galleryImg = galleryImageUrls.map((img) => img.url);
    // if (!profileImage) {
    //     throw new ApiError(400, "profileImage file is required")
    // }
    // if (!idProofImage) {
    //     throw new ApiError(400, "idProofImage file is required")
    // }

    const newAstrologer = new Astrologer({
        displayName,
        name,
        email,
        password,
        phoneCode,
        phoneNumber,
        gender,
        dateOfBirth,
        experience,
        language,
        address,
        currencyType,
        currencyValue,
        country,
        state,
        city,
        zipCode,
        about,
        educationQualification,
        astrologyQualification,
        follower_count,
        rating,
        profileImage: profileImage.url,
        idProofImage: idProofImage.url,
        galleryImage: galleryImg,
        bankProofImage,
        bankAcountNumber,
        bankName,
        accountType,
        ifscCode,
        accouuntHolderName,
        addharNumber,
        panNumber,
        chatPrice,
        companyChatPrice,
        callPrice,
        companyCallPrice,
        liveVideoPrice,
        companyLiveVideoPrice,
        liveCallPrice,
        companyLiveCallPrice,
        skill: skillArray,
        expertise: expertiseArray,
        remedies: remediesArray,
        astrologerType,
        status,
    });

    const astrologer = await newAstrologer.save();

    const createdUser = await Astrologer.findById(astrologer._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    return createdUser;
};


const updateAstrologer = async (id, updatedFields) => {
    try {
        const astrologer = await Astrologer.findOneAndUpdate(
            { _id: id },
            updatedFields,
            { new: true }
        );

        if (!astrologer) {
            throw new ApiError(404, "Astrologer not found");
        }

        return astrologer;
    } catch (error) {
        throw new ApiError(500, "Internal Server Error - Astrologer Not Updated");
    }
}


export { getAstrologer, getAstrologerById, addNewAstrologer, updateAstrologer };
