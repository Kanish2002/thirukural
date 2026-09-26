package dev.kanish.thirukkuraldaily

import android.app.Activity
import android.graphics.Typeface
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import java.util.concurrent.Executors

class MainActivity : Activity() {
    private val executor = Executors.newSingleThreadExecutor()
    private val mainHandler = Handler(Looper.getMainLooper())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        showLoading()

        executor.execute {
            val kural = KuralApi.loadToday(applicationContext)
            mainHandler.post { showKural(kural) }
        }
    }

    override fun onDestroy() {
        executor.shutdownNow()
        super.onDestroy()
    }

    private fun showLoading() {
        val root = baseRoot()
        val progress = ProgressBar(this)
        root.addView(progress)
        val label = text("இன்றைய திருக்குறள் ஏற்றப்படுகிறது…", 16f, false)
        label.setPadding(0, dp(20), 0, 0)
        root.addView(label)
        setContentView(root)
    }

    private fun showKural(kural: Kural) {
        val root = baseRoot()

        val brand = text("திருக்குறள் DAILY", 13f, true)
        brand.letterSpacing = 0.08f
        root.addView(brand)

        val number = text("#${kural.number.toString().padStart(4, '0')}", 14f, false)
        number.setPadding(0, dp(22), 0, 0)
        root.addView(number)

        val meta = text("${kural.sectionTamil}  •  ${kural.chapterTamil}", 14f, false)
        meta.setPadding(0, dp(8), 0, 0)
        root.addView(meta)

        val verse = text("${kural.line1}\n${kural.line2}", 28f, true)
        verse.setLineSpacing(dp(10).toFloat(), 1.15f)
        verse.setPadding(0, dp(44), 0, dp(38))
        root.addView(verse)

        val heading = text("பொருள்", 18f, true)
        root.addView(heading)

        val meaning = text(kural.meaningTamil, 17f, false)
        meaning.setLineSpacing(dp(7).toFloat(), 1.12f)
        meaning.setPadding(0, dp(14), 0, 0)
        root.addView(meaning)

        val note = text("Home screen-ல் Widget சேர்க்க launcher-ஐ long-press செய்து Widgets → திருக்குறள் Daily என்பதைத் தேர்ந்தெடுக்கவும்.", 13f, false)
        note.alpha = 0.72f
        note.setPadding(0, dp(42), 0, 0)
        root.addView(note)

        setContentView(root)
    }

    private fun baseRoot(): LinearLayout {
        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_HORIZONTAL
            setPadding(dp(28), dp(42), dp(28), dp(42))
            setBackgroundColor(0xFF14100C.toInt())
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }
    }

    private fun text(value: String, size: Float, bold: Boolean): TextView {
        return TextView(this).apply {
            text = value
            textSize = size
            setTextColor(0xFFF7F0E2.toInt())
            if (bold) setTypeface(typeface, Typeface.BOLD)
        }
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()
}
