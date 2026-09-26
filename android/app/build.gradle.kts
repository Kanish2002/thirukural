plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "dev.kanish.thirukkuraldaily"
    compileSdk = 35

    defaultConfig {
        applicationId = "dev.kanish.thirukkuraldaily"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "0.1.0"

        buildConfigField("String", "KURAL_API_BASE_URL", "\"https://kural.codewithram.dev/api\"")
        buildConfigField("String", "WEB_BASE_URL", "\"https://thirukkural-daily.vercel.app\"")
    }

    buildFeatures {
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib:2.1.20")
}
