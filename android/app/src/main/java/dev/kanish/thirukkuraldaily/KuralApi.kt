package dev.kanish.thirukkuraldaily

import android.content.Context
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

object KuralApi {
    private const val PREFS = "kural_cache"
    private const val KEY_JSON = "latest_json"

    fun loadToday(context: Context): Kural {
        val number = DailyKural.numberFor()
        return try {
            val json = fetch(number)
            context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .edit()
                .putString(KEY_JSON, json)
                .apply()
            parse(json)
        } catch (error: Exception) {
            val cached = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .getString(KEY_JSON, null)
            if (cached != null) parse(cached) else fallback(number)
        }
    }

    private fun fetch(number: Int): String {
        val base = BuildConfig.KURAL_API_BASE_URL.trimEnd('/')
        val connection = URL("$base/kural/$number").openConnection() as HttpURLConnection
        connection.connectTimeout = 8_000
        connection.readTimeout = 8_000
        connection.requestMethod = "GET"
        connection.setRequestProperty("Accept", "application/json")
        connection.setRequestProperty("User-Agent", "ThirukkuralDaily-Android/0.1")

        return try {
            val code = connection.responseCode
            if (code !in 200..299) throw IOException("HTTP $code")
            connection.inputStream.bufferedReader(Charsets.UTF_8).use { it.readText() }
        } finally {
            connection.disconnect()
        }
    }

    private fun parse(raw: String): Kural {
        val root = JSONObject(raw)
        val number = root.getInt("number")
        val kural = root.getJSONArray("kural")
        val meaning = root.getJSONObject("meaning")
        val sectionTamil = root.optJSONObject("section")
            ?.optJSONObject("names")
            ?.optString("ta")
            .orEmpty()
        val chapterTamil = root.optJSONObject("chapter")
            ?.optJSONObject("names")
            ?.optString("ta")
            .orEmpty()

        val preferredMeaning = sequenceOf("ta_salamon", "ta_mu_va", "ta_kalaignar")
            .map { meaning.optString(it).trim() }
            .firstOrNull { it.isNotBlank() }
            ?: "தமிழ் பொருள் தற்போது கிடைக்கவில்லை."

        return Kural(
            number = number,
            sectionTamil = sectionTamil.ifBlank { "திருக்குறள்" },
            chapterTamil = chapterTamil.ifBlank { "அதிகாரம் ${(number - 1) / 10 + 1}" },
            line1 = kural.optString(0),
            line2 = kural.optString(1),
            meaningTamil = preferredMeaning
        )
    }

    private fun fallback(number: Int): Kural = Kural(
        number = number,
        sectionTamil = "திருக்குறள்",
        chapterTamil = "இன்றைய குறள்",
        line1 = "இணைய இணைப்பு கிடைக்கவில்லை",
        line2 = "மீண்டும் இணைந்ததும் குறள் புதுப்பிக்கப்படும்.",
        meaningTamil = "கடைசியாக சேமிக்கப்பட்ட குறள் இல்லாததால் இன்றைய பொருளை காட்ட முடியவில்லை."
    )
}
