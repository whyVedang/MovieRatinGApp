
import { Outlet, useSearchParams } from "react-router-dom";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { CaretDownIcon, MagnifyingGlassIcon, HamburgerMenuIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSearchChange = (e) => {
        setSearchParams({ search: e.target.value });
    };

    return (
        <div>
            <nav className="bg-gradient-to-r from-[#0a2540] to-[#1b314d] px-4 md:px-8 py-3 shadow-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <a href="/" className="font-black text-2xl tracking-tight flex items-center space-x-2">
                        <span className="bg-gradient-to-r from-[#635bff] to-[#00d4ff] bg-clip-text text-transparent">
                            MovieHub
                        </span>
                    </a>

                    {/* Desktop Nav & Search */}
                    <div className="hidden md:flex flex-1 items-center justify-center gap-8">
                        {/* Navigation Menu */}
                        <NavigationMenu.Root>
                            <NavigationMenu.List className="flex gap-6">
                                {/* Movies Dropdown */}
                                <NavigationMenu.Item>
                                    <NavigationMenu.Trigger className="flex items-center gap-1 font-medium text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        Movies<CaretDownIcon className="text-gray-400" />
                                    </NavigationMenu.Trigger>
                                    <NavigationMenu.Content className="absolute mt-2 min-w-[220px] rounded-xl bg-gray-800 border border-gray-700 shadow-lg p-2 z-50">
                                        <div className="flex flex-col">
                                            <a className="px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition flex items-center gap-2" href="#">
                                                <span className="text-indigo-400">★</span> Top Rated
                                            </a>
                                            <a className="px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition flex items-center gap-2" href="#">
                                                <span className="text-indigo-400">🔥</span> Popular
                                            </a>
                                            <a className="px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition flex items-center gap-2" href="#">
                                                <span className="text-indigo-400">📅</span> Upcoming
                                            </a>
                                            <a className="px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition flex items-center gap-2" href="#">
                                                <span className="text-indigo-400">🎬</span> Now Playing
                                            </a>
                                            <div className="border-t border-gray-700 my-1"></div>
                                            <a className="px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition flex items-center gap-2" href="#">
                                                <span className="text-indigo-400">🔍</span> Browse All
                                            </a>
                                        </div>
                                    </NavigationMenu.Content>
                                </NavigationMenu.Item>
                                {/* TV Shows Dropdown */}
                                <NavigationMenu.Item>
                                    <NavigationMenu.Trigger className="flex items-center gap-1 font-medium text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        TV Shows <CaretDownIcon className="text-gray-400" />
                                    </NavigationMenu.Trigger>
                                    <NavigationMenu.Content className="absolute mt-2 min-w-[220px] rounded-xl bg-gray-800 border border-gray-700 shadow-lg p-2 z-50">
                                        <div className="flex flex-col">
                                            <a className="px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition flex items-center gap-2" href="#">
                                                <span className="text-indigo-400">★</span> Top Rated
                                            </a>
                                            <a className="px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition flex items-center gap-2" href="#">
                                                <span className="text-indigo-400">🔥</span> Popular
                                            </a>
                                            <a className="px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition flex items-center gap-2" href="#">
                                                <span className="text-indigo-400">📅</span> New Releases
                                            </a>
                                            <a className="px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition flex items-center gap-2" href="#">
                                                <span className="text-indigo-400">📺</span> On Air
                                            </a>
                                            <div className="border-t border-gray-700 my-1"></div>
                                            <a className="px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition flex items-center gap-2" href="#">
                                                <span className="text-indigo-400">🔍</span> Browse All
                                            </a>
                                        </div>
                                    </NavigationMenu.Content>
                                </NavigationMenu.Item>
                                {/* Watchlist */}
                                <NavigationMenu.Item>
                                    <NavigationMenu.Trigger
                                        className="flex items-center gap-1 font-medium text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        Watchlist
                                    </NavigationMenu.Trigger>
                                </NavigationMenu.Item>

                            </NavigationMenu.List>
                        </NavigationMenu.Root>
                        {/* Search Bar */}
                        <div className="w-72">
                            <div className="relative w-full">

                                <input
                                    className="bg-gray-800 w-full px-4 py-2 rounded-full text-gray-300 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Search movies, TV shows"
                                    type="text"
                                    value={searchParams.get("search") || ""}
                                    onChange={handleSearchChange}
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400">
                                    <MagnifyingGlassIcon className="w-5 h-5" />
                                </button>

                            </div>
                        </div>
                    </div>

                    {/* Profile Button (always visible) */}
                    <button className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-indigo-400 hover:border-indigo-500 transition-colors ml-2 md:ml-6">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor" />
                        </svg>
                    </button>

                    {/* Hamburger for mobile */}
                    <div className="md:hidden">
                        <Dialog.Root open={open} onOpenChange={setOpen}>
                            <Dialog.Trigger asChild>
                                <button className="ml-2 p-2 rounded-md text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <HamburgerMenuIcon className="w-6 h-6" />
                                </button>
                            </Dialog.Trigger>
                            <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
                            <Dialog.Content className="fixed top-0 right-0 w-[85vw] max-w-xs h-full bg-[#0a2540] z-50 shadow-lg flex flex-col">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                                    <span className="font-black text-xl bg-gradient-to-r from-[#635bff] to-[#00d4ff] bg-clip-text text-transparent">
                                        Movies
                                    </span>
                                    <Dialog.Close asChild>
                                        <button className="p-2 rounded-md text-gray-300 hover:bg-gray-800">
                                            <Cross2Icon className="w-5 h-5" />
                                        </button>
                                    </Dialog.Close>
                                </div>
                                <div className="flex-1 flex flex-col gap-2 px-4 py-4">
                                    {/* Nav Links */}
                                    <a className="py-2 px-2 rounded text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition" href="#">Movies</a>
                                    <a className="py-2 px-2 rounded text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition" href="#">TV Shows</a>
                                    <a className="py-2 px-2 rounded text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition" href="#">Watchlist</a>
                                    {/* Search */}
                                    <div className="mt-4">
                                        <div className="relative w-full">
                                            <input
                                                className="bg-gray-800 w-full px-4 py-2 rounded-full text-gray-300 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Search movies, TV shows, actors..."
                                                type="text"
                                            />
                                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400">
                                                <MagnifyingGlassIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Content>
                        </Dialog.Root>
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    );
}