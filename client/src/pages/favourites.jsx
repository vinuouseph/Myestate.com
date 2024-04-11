import React from 'react';

const FavoritePropertiesPage = () => {
    // Sample favorite properties data
    const favoriteProperties = [
        { name: "Property 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
        { name: "Property 2", description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
        { name: "Property 3", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." }
        // Add more properties as needed
    ];

    return (
        <div className="bg-gray-100 min-h-screen py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <h1 className="text-center text-3xl font-semibold mb-10">Favorite Properties</h1>
                    <ul className="divide-y divide-gray-200">
                        {favoriteProperties.map((property, index) => (
                            <li key={index} className="py-4">
                                <div className="flex space-x-3">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-lg font-semibold text-gray-900">{property.name}</p>
                                        <p className="text-sm text-gray-500">{property.description}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FavoritePropertiesPage;
