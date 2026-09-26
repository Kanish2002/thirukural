package dev.kanish.thirukkuraldaily

import java.time.LocalDate
import java.time.temporal.ChronoUnit

object DailyKural {
    private val startDate: LocalDate = LocalDate.of(2026, 9, 27)
    private const val kuralCount = 1330

    fun numberFor(date: LocalDate = LocalDate.now()): Int {
        val days = ChronoUnit.DAYS.between(startDate, date)
        return Math.floorMod(days, kuralCount.toLong()).toInt() + 1
    }
}
