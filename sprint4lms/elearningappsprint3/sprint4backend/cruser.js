const User = require("./models/User");

async function createUser() {
    try {
        const user = new User({
            first_name: "ayoub",
            username: "ayoubsmayen",
            name: "ayoub smayen ",
            email: "ayoubjobs.2019@gmail.com",
            password: "123456az@", // Ce mot de passe sera haché
            phoneNumber: 29966019,
            totalEarnings: 0,
            addresses: [
                {
                    country: "TUNISA",
                    city: "nabeul ",
                    address1: "123 Main St",
                    address2: "Apt 4B",
                    zipCode: 8000,
                    addressType: "home",
                },
            ],
        });

        await user.save();
        console.log("Utilisateur créé avec succès : ", user);
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur : ", error);
    }
}

createUser();
