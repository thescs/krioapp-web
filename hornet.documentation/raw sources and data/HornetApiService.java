package com.hornet.android.net;

import android.support.annotation.NonNull;
import com.hornet.android.models.net.BlockList;
import com.hornet.android.models.net.Channel;
import com.hornet.android.models.net.DeviceToken;
import com.hornet.android.models.net.FilterList;
import com.hornet.android.models.net.HashtagsListWrapper;
import com.hornet.android.models.net.PhotoPermissionList;
import com.hornet.android.models.net.PremiumMembership;
import com.hornet.android.models.net.Sticker;
import com.hornet.android.models.net.conversation.ConversationList;
import com.hornet.android.models.net.conversation.ConversationMessages;
import com.hornet.android.models.net.conversation.Message;
import com.hornet.android.models.net.conversation.MessageResponse;
import com.hornet.android.models.net.filters.FilterWrapper;
import com.hornet.android.models.net.lookup.LookupList;
import com.hornet.android.models.net.photo.TempPhotoWrapper;
import com.hornet.android.models.net.request.AddFavouriteRequest;
import com.hornet.android.models.net.request.BlockRequest;
import com.hornet.android.models.net.request.BranchTransactionRequest.Wrapper;
import com.hornet.android.models.net.request.ContentLike;
import com.hornet.android.models.net.request.CreateAccountRequest;
import com.hornet.android.models.net.request.FeedbackRequest;
import com.hornet.android.models.net.request.ReportRequest;
import com.hornet.android.models.net.request.SessionRequest;
import com.hornet.android.models.net.request.TransactionWrapper;
import com.hornet.android.models.net.request.UpdatePhotoIndexRequest;
import com.hornet.android.models.net.request.UpdatePhotoModeRequest.Wrapper;
import com.hornet.android.models.net.request.ViewedMeRequest;
import com.hornet.android.models.net.request.profile.AccountSetEmailWrapper;
import com.hornet.android.models.net.request.profile.AccountSetPasswordWrapper;
import com.hornet.android.models.net.request.profile.AccountSetPublicWrapper;
import com.hornet.android.models.net.request.profile.AccountSetUsernameWrapper;
import com.hornet.android.models.net.request.profile.ProfileSelectiveUpdateWrapper;
import com.hornet.android.models.net.response.Activities.Activity.Wrapper;
import com.hornet.android.models.net.response.Activities.Wrapper;
import com.hornet.android.models.net.response.DiscoverResponse;
import com.hornet.android.models.net.response.Event.Wrapper;
import com.hornet.android.models.net.response.EventsWrapper;
import com.hornet.android.models.net.response.FavouriteResponse;
import com.hornet.android.models.net.response.FeedPhotoUploadResult;
import com.hornet.android.models.net.response.FullMemberWrapper;
import com.hornet.android.models.net.response.MemberList;
import com.hornet.android.models.net.response.PhotosList;
import com.hornet.android.models.net.response.Place.Wrapper;
import com.hornet.android.models.net.response.PlacesWrapper;
import com.hornet.android.models.net.response.ProfilePhotoUploadResult;
import com.hornet.android.models.net.response.SessionData;
import com.hornet.android.models.net.response.Stories.Wrapper;
import com.hornet.android.models.net.response.Story.Wrapper;
import com.hornet.android.models.net.response.Totals;
import io.reactivex.Completable;
import io.reactivex.Single;
import java.util.ArrayList;
import okhttp3.RequestBody;
import retrofit2.Response;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public abstract interface HornetApiService
{
  @POST("favourites")
  public abstract Single<FavouriteResponse> addFavourite(@Body AddFavouriteRequest paramAddFavouriteRequest);
  
  @POST("blocks")
  public abstract Completable blockUser(@Body BlockRequest paramBlockRequest);
  
  @PUT("photos/{id}")
  public abstract Completable changePhotoMode(@Path("id") String paramString, @Body UpdatePhotoModeRequest.Wrapper paramWrapper);
  
  @DELETE("filters/{filter_category}")
  public abstract Completable clearFilterCategory(@Path("filter_category") String paramString);
  
  @POST("accounts.json")
  public abstract Completable createAccount(@Body CreateAccountRequest paramCreateAccountRequest);
  
  @DELETE("account")
  public abstract Completable deleteAccount();
  
  @DELETE("messages/{memberId}")
  public abstract Completable deleteConversation(@Path("memberId") String paramString);
  
  @DELETE("activities/{activityId}")
  public abstract Completable deleteOwnActivity(@Path("activityId") String paramString);
  
  @GET("events")
  public abstract Single<EventsWrapper> discoverEvents(@Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("places")
  public abstract Single<PlacesWrapper> discoverPlaces(@Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("stories/{flavour}")
  public abstract Single<Stories.Wrapper> discoverStories(@Path(encoded=true, value="flavour") String paramString, @Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @POST("app_stores/branch/transactions")
  public abstract Completable doBranchRedeemPremiumMembershipTransaction(@Body BranchTransactionRequest.Wrapper paramWrapper);
  
  @POST("app_stores/play/transactions")
  public abstract Completable doPremiumMembershipTransaction(@Body TransactionWrapper paramTransactionWrapper);
  
  @DELETE("session")
  public abstract Completable endSession();
  
  @GET("members/explore.json")
  public abstract Single<MemberList> explore(@Query("lat") double paramDouble1, @Query("lng") double paramDouble2, @Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("activities/{activityId}")
  public abstract Single<Activities.Activity.Wrapper> getActivity(@Path("activityId") String paramString);
  
  @GET("activities/{id}/members")
  public abstract Single<MemberList> getActivityMembers(@Path("id") String paramString, @Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("blocks")
  public abstract Single<BlockList> getBlockedUsers(@Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("app_stores/branch/products")
  public abstract Single<ArrayList<PremiumMembership>> getBranchRedeemablePremiumMemberships();
  
  @GET("messages/conversations.json")
  public abstract Single<ConversationList> getConversations(@Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("discover")
  public abstract Single<DiscoverResponse> getDiscover();
  
  @GET("events/{eventId}")
  public abstract Single<Event.Wrapper> getEventById(@Path(encoded=true, value="eventId") String paramString);
  
  @GET("favourites/fans")
  public abstract Single<MemberList> getFans(@Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("favourites/favourites")
  public abstract Single<MemberList> getFavourites(@Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("filters")
  public abstract Single<FilterList> getFilters();
  
  @GET("messages/{id}/conversation.json")
  public abstract Single<ConversationMessages> getFullConversation(@Path("id") String paramString, @Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("members/{id}.json")
  public abstract Single<FullMemberWrapper> getFullMember(@Path("id") String paramString, @Query("gallery_preview_photos") int paramInt);
  
  @GET("members/{username}/public")
  public abstract Single<FullMemberWrapper> getFullMemberByUsername(@Path("username") String paramString);
  
  @GET("hashtags/suggest")
  public abstract Single<HashtagsListWrapper> getHashtagSuggestions(@NonNull @Query("query") String paramString);
  
  @GET("lookup_data/all.json")
  public abstract Single<LookupList> getLookupData();
  
  @GET("favourites/matches")
  public abstract Single<MemberList> getMatches(@Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("members/{id}/photos/stream.json")
  public abstract Single<PhotosList> getMemberPhotoStream(@Path("id") String paramString, @Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("members/{id}/photos/private.json")
  public abstract Single<PhotosList> getMemberPrivatePhotos(@Path("id") String paramString, @Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("feeds/{id}")
  public abstract Single<Activities.Wrapper> getMemberTimelineFeedAfterToken(@Path("id") String paramString1, @Query("after") String paramString2, @Query("per_page") int paramInt);
  
  @GET("feeds/{id}")
  public abstract Single<Activities.Wrapper> getMemberTimelineFeedBeforeToken(@Path("id") String paramString1, @Query("before") String paramString2, @Query("per_page") int paramInt);
  
  @GET("messages/channel")
  public abstract Single<Channel> getMessagesChannel();
  
  @GET("members/near")
  public abstract Single<MemberList> getNearby(@Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("feeds/notifications")
  public abstract Single<Activities.Wrapper> getNotificationsAfterToken(@Query("after") String paramString, @Query("per_page") int paramInt);
  
  @GET("permissions/private_photo_access")
  public abstract Single<PhotoPermissionList> getPhotoPermissions(@Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("places/{placeId}")
  public abstract Single<Place.Wrapper> getPlaceById(@Path(encoded=true, value="placeId") String paramString);
  
  @GET("hashtags/popular")
  public abstract Single<HashtagsListWrapper> getPopularHashtags();
  
  @GET("app_stores/play/products")
  public abstract Single<ArrayList<PremiumMembership>> getPremiumMemberships();
  
  @GET("members/recent.json")
  public abstract Single<MemberList> getRecent(@Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("{kind}/{id}/followers")
  public abstract Single<MemberList> getSpecificListMembers(@Path(encoded=true, value="kind") String paramString1, @Path("id") String paramString2, @Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("app_stores/play/products?product_class=stickers")
  public abstract Single<ArrayList<Sticker>> getStickers();
  
  @GET("stories/{storyId}")
  public abstract Single<Story.Wrapper> getStoryById(@Path(encoded=true, value="storyId") String paramString);
  
  @GET("stories/{storySlug}")
  public abstract Single<Story.Wrapper> getStoryBySlug(@Path(encoded=true, value="storySlug") String paramString);
  
  @GET("members/recommendations.json")
  public abstract Single<MemberList> getSuggested(@Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("feeds/timeline")
  public abstract Single<Activities.Wrapper> getTimelineFeedAfterToken(@Query("after") String paramString, @Query("per_page") int paramInt);
  
  @GET("feeds/timeline")
  public abstract Single<Activities.Wrapper> getTimelineFeedBeforeToken(@Query("before") String paramString, @Query("per_page") int paramInt);
  
  @GET("session/totals")
  public abstract Single<Totals> getUserTotals();
  
  @GET("members/viewed_me")
  public abstract Single<MemberList> getViewedMe(@Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @POST("session.json")
  public abstract Single<SessionData> login(@Body SessionRequest paramSessionRequest);
  
  @PUT("messages/mark_all_conversations_as_read")
  public abstract Completable markAllAsRead(@Body String paramString);
  
  @PUT("messages/{id}/read")
  public abstract Completable markAsRead(@Path("id") String paramString);
  
  @PUT("{kind}/{id}/reaction")
  public abstract Completable reactTo(@Path(encoded=true, value="kind") String paramString1, @Path(encoded=true, value="id") String paramString2, @Body ContentLike paramContentLike);
  
  @PUT("activities/{activityId}/reaction")
  public abstract Completable reactToActivity(@Path("activityId") String paramString, @Body ContentLike paramContentLike);
  
  @PUT("events/{eventId}/reaction")
  public abstract Completable reactToEvent(@Path(encoded=true, value="eventId") String paramString, @Body ContentLike paramContentLike);
  
  @PUT("places/{placeId}/reaction")
  public abstract Completable reactToPlace(@Path(encoded=true, value="placeId") String paramString, @Body ContentLike paramContentLike);
  
  @PUT("stories/{storyId}/reaction")
  public abstract Completable reactToStory(@Path(encoded=true, value="storyId") String paramString, @Body ContentLike paramContentLike);
  
  @DELETE("blocks/destroy_all")
  public abstract Completable removeAllBlocks();
  
  @DELETE("blocks/{memberId}")
  public abstract Completable removeBlock(@Path("memberId") String paramString);
  
  @DELETE("favourites/{id}")
  public abstract Completable removeFavourite(@Path("id") String paramString);
  
  @DELETE("photos/{id}.json")
  public abstract Completable removePhoto(@Path("id") String paramString);
  
  @POST("activities/{activityId}/report")
  public abstract Completable reportActivity(@Path("activityId") String paramString, @Body ReportRequest paramReportRequest);
  
  @POST("reports")
  public abstract Completable reportUser(@Body ReportRequest paramReportRequest);
  
  @FormUrlEncoded
  @POST("password_resets.json")
  public abstract Completable resetPassword(@Field("email") String paramString);
  
  @DELETE("permissions/destroy_all")
  public abstract Completable revokeAllPhotoPermissions();
  
  @GET("members/search")
  public abstract Single<MemberList> searchHashtags(@Query("hashtags") String paramString, @Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @GET("members/search")
  public abstract Single<MemberList> searchUsernames(@Query("username") String paramString, @Query("page") int paramInt1, @Query("per_page") int paramInt2);
  
  @POST("reviews")
  public abstract Completable sendFeedback(@Body FeedbackRequest paramFeedbackRequest);
  
  @PUT("account/device.json")
  public abstract Single<Response<Void>> sendGCMToken(@Body DeviceToken paramDeviceToken);
  
  @POST("messages.json")
  public abstract Single<MessageResponse> sendMessageObservable(@Body Message paramMessage);
  
  @POST("members/viewed")
  public abstract Completable sendViewedProfiles(@Body ViewedMeRequest paramViewedMeRequest);
  
  @PUT("account")
  public abstract Completable setAccountEmail(@Body AccountSetEmailWrapper paramAccountSetEmailWrapper);
  
  @PUT("account")
  public abstract Completable setAccountPassword(@Body AccountSetPasswordWrapper paramAccountSetPasswordWrapper);
  
  @PUT("account")
  public abstract Completable setAccountPublic(@Body AccountSetPublicWrapper paramAccountSetPublicWrapper);
  
  @PUT("account")
  public abstract Completable setAccountUsername(@Body AccountSetUsernameWrapper paramAccountSetUsernameWrapper);
  
  @POST("filters")
  public abstract Completable setFilter(@Body FilterWrapper paramFilterWrapper);
  
  @POST("filters")
  public abstract Completable setFilters(@Body FilterList paramFilterList);
  
  @PUT("stories/{storyId}/track")
  public abstract Completable trackStoryView(@Path("storyId") String paramString);
  
  @PUT("photos/slots.json")
  public abstract Completable updatePhotoSlots(@Body UpdatePhotoIndexRequest paramUpdatePhotoIndexRequest);
  
  @PUT("account/profile")
  public abstract Completable updateProfile(@Body ProfileSelectiveUpdateWrapper paramProfileSelectiveUpdateWrapper);
  
  @POST("feed_photos.json")
  public abstract Single<FeedPhotoUploadResult> uploadFeedPhoto(@Body RequestBody paramRequestBody);
  
  @POST("photos/share.json")
  public abstract Single<TempPhotoWrapper> uploadPhoto(@Body RequestBody paramRequestBody);
  
  @POST("photos.json")
  public abstract Single<ProfilePhotoUploadResult> uploadProfilePhoto(@Body RequestBody paramRequestBody);
}
