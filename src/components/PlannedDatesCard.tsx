import { CalendarDays, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlannedDates } from "@/features/hikes/usePlannedDates";
import { format } from "date-fns";

export default function PlannedDatesCard() {
	const { data: plannedDates = [], isLoading } = usePlannedDates();

	const groupedDates = plannedDates.reduce((acc, item) => {
		const month = format(new Date(item.date), "MMMM");
		if (!acc[month]) {
			acc[month] = [];
		}
		acc[month].push(item);
		return acc;
	}, {} as Record<string, typeof plannedDates>);

  	return (
		<div className="mx-auto max-w-4xl">
			<div className="mb-4 grid grid-cols-2 gap-4 lg:flex lg:flex-wrap lg:justify-center">
				{isLoading ? (
					Array.from({ length: 4 }).map((_, index) => (
						<Card key={index} className="lg:w-[calc(25%-0.75rem)] border-primary/20 bg-background/60 shadow-md backdrop-blur-sm">
							<CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 text-center h-full">
								<div className="mb-3 flex items-center justify-center gap-2">
									<Skeleton className="h-6 w-6 rounded-full" />
									<Skeleton className="h-6 w-20" />
								</div>
								<div className="flex flex-col items-center gap-2">
									<Skeleton className="h-5 w-16" />
									<Skeleton className="h-4 w-24" />
								</div>
							</CardContent>
						</Card>
					))
				) : plannedDates.length > 0 ? (
					Object.entries(groupedDates).map(([month, items]) => (
						<Card key={month} className="lg:w-[calc(25%-0.75rem)] border-primary/20 bg-background/60 transition-all hover:border-primary/40 backdrop-blur-sm">
							<CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 text-center h-full">
								<div className="mb-2 flex items-center gap-2 text-primary sm:mb-3">
									<CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" />
									<span className="text-lg sm:text-2xl font-bold">{month}</span>
								</div>
								<div className="flex flex-col gap-2 w-full">
									{items.map((item) => (
										<div key={item.id} className="flex flex-wrap items-center justify-center gap-2">
											<span className="font-semibold text-base sm:text-lg tabular-nums text-foreground">
												{format(new Date(item.date), "dd.MM")}
											</span>
											{item.description && (
												<span className="text-xs sm:text-sm font-medium text-muted-foreground">
													{item.description}
												</span>
											)}
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<div className="col-span-full text-center text-muted-foreground">
						<p>No planned hikes announced for this semester.</p>
					</div>
				)}
			</div>

			<div className="mx-auto flex max-w-3xl items-center gap-4 rounded-xl border border-primary/10 bg-card p-6 shadow-sm">
				<div className="rounded-full bg-primary/10 p-3">
					<Info className="h-6 w-6 text-primary" />
				</div>
				<div className="flex flex-col gap-2">
					<p className="text-muted-foreground text-sm sm:text-base">
						Check out the <a href="/faq#when-will-i-get-more-information-about-next-hike" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">Frequently Asked Questions</a> for details about the upcoming hikes.
					</p>
					<p className="text-muted-foreground text-sm sm:text-base">
						More spontaneous hikes can also be organized at any time.
					</p>
				</div>
			</div>
		</div>
	);
}
