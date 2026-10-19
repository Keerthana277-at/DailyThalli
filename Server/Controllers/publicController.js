const Menu = require("../models/Menu");

const getPublicMenu = async (req, res) => {
    try {
        const menuItems = await Menu.find({ available: true })
            .select("name description price category available")
            .sort({ category: 1, name: 1 });

        return res.status(200).json({
            message: "Menu fetched successfully",
            menuItems
        });
    } catch (error) {
        console.log("Public menu error:", error.message);

        return res.status(500).json({
            message: "Unable to fetch menu"
        });
    }
};

module.exports = { getPublicMenu };