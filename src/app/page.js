"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../Context/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ToastContainer } from "react-toastify";
import CryptoJS from "crypto-js";

const PasswordInput = ({
  value,
  onChange,
  required = true,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    if (!buttonRef.current?.contains(e.relatedTarget)) {
      setIsFocused(false);
      setShowPassword(false);
    }
  };

  const togglePassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleTabChange = () => {
      setShowPassword(false);
      setIsFocused(false);
    };

    document.addEventListener("visibilitychange", handleTabChange);

    return () => {
      document.removeEventListener("visibilitychange", handleTabChange);
      setShowPassword(false);
      setIsFocused(false);
    };
  }, []);

  return (
    <div className="relative flex items-center">
      <input
        ref={inputRef}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500
          text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500
          focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder="Password"
        autoComplete="current-password"
      />
      {isFocused && !disabled && (
        <button
          ref={buttonRef}
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 z-20 text-gray-600 cursor-pointer hover:text-gray-800"
          onMouseDown={togglePassword}
          tabIndex={-1}
        >
          {showPassword ? (
            <AiOutlineEyeInvisible className="h-5 w-5" />
          ) : (
            <AiOutlineEye className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
      try {
        const { email, password } = JSON.parse(rememberedUser);
        setEmail(email);
        setPassword(password);
        setRememberMe(true);
      } catch (error) {
        console.error("Error parsing remembered user:", error);
        localStorage.removeItem("rememberedUser");
      }
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Encrypt password using SHA-256
      const hashedPassword = CryptoJS.SHA256(password).toString(
        CryptoJS.enc.Hex
      );

      // Replace password with hashed password for login request
      await login(email, hashedPassword, rememberMe);

      if (rememberMe) {
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({ email, password: hashedPassword })
        );
      } else {
        localStorage.removeItem("rememberedUser");
      }
    } catch (error) {
      console.error("Could not login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <ToastContainer style={{ fontSize: "12px", zIndex: 1000 }} />
      <main>
        <div
          className="min-h-[125vh] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://sustainextstorage1.blob.core.windows.net/sustainext-frontend-assets/Home/authbg.webp')",
          }}
        >
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 h-screen">
            <div className="mb-4">
              <img
                src="https://sustainextstorage1.blob.core.windows.net/sustainext-frontend-assets/Home/sustainext-new-white-logo.webp"
                alt="Logo"
                className="h-28 w-auto"
              />
            </div>
            <div className="bg-white shadow-lg rounded-lg p-16 max-w-md w-full my-20 mx-auto h-[456px]">
              <h2 className="text-left text-2xl font-extrabold text-gray-900">
                Welcome back
              </h2>
              <p className="text-sm mb-6">Login to sustainable solutions</p>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="email" className="text-sm">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500
                      text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500
                      focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-6 relative">
                  <label htmlFor="password" className="text-sm">
                    Password
                  </label>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input
                      id="remember_me"
                      name="remember_me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:cursor-not-allowed"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="remember_me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="/forgot-password"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-[#007EEF] to-[#2AE4FF] hover:bg-gradient-to-r hover:from-[#00aeef] hover:to-[#6adf23] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
