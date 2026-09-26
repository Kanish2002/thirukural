package dev.kanish.thirukkuraldaily

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import java.util.concurrent.Executors

class KuralWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, manager: AppWidgetManager, appWidgetIds: IntArray) {
        refresh(context, manager, appWidgetIds)
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)

        if (intent.action in setOf(
                Intent.ACTION_DATE_CHANGED,
                Intent.ACTION_TIME_CHANGED,
                Intent.ACTION_TIMEZONE_CHANGED
            )
        ) {
            val manager = AppWidgetManager.getInstance(context)
            val ids = manager.getAppWidgetIds(ComponentName(context, KuralWidgetProvider::class.java))
            refresh(context, manager, ids)
        }
    }

    private fun refresh(context: Context, manager: AppWidgetManager, ids: IntArray) {
        if (ids.isEmpty()) return

        ids.forEach { id ->
            val loading = RemoteViews(context.packageName, R.layout.widget_kural)
            loading.setTextViewText(R.id.widget_number, "#${DailyKural.numberFor().toString().padStart(4, '0')}")
            loading.setTextViewText(R.id.widget_line1, context.getString(R.string.loading))
            loading.setTextViewText(R.id.widget_line2, "")
            loading.setTextViewText(R.id.widget_meaning, "")
            manager.updateAppWidget(id, loading)
        }

        val pendingResult = goAsync()
        executor.execute {
            try {
                val kural = KuralApi.loadToday(context.applicationContext)
                ids.forEach { id -> manager.updateAppWidget(id, render(context, kural)) }
            } finally {
                pendingResult.finish()
            }
        }
    }

    private fun render(context: Context, kural: Kural): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.widget_kural)
        views.setTextViewText(R.id.widget_number, "#${kural.number.toString().padStart(4, '0')}")
        views.setTextViewText(R.id.widget_meta, "${kural.sectionTamil}  •  ${kural.chapterTamil}")
        views.setTextViewText(R.id.widget_line1, kural.line1)
        views.setTextViewText(R.id.widget_line2, kural.line2)
        views.setTextViewText(R.id.widget_meaning, kural.meaningTamil)

        val url = "${BuildConfig.WEB_BASE_URL.trimEnd('/')}/kural/${kural.number}"
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
        val pendingIntent = PendingIntent.getActivity(
            context,
            kural.number,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)
        return views
    }

    companion object {
        private val executor = Executors.newSingleThreadExecutor()
    }
}
