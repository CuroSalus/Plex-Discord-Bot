# Plex Discord Bot

See the [original repo by danxfisher!](https://github.com/danxfisher/Plex-Discord-Bot)

See the [repo by CyaOnDaNet from which this code is based on!](https://github.com/CyaOnDaNet/Plex-Discord-Bot)

## Installation

1. Install Node.js: https://nodejs.org/
2. Clone or Download the repo.
3. Navigate to the root folder and in the console, type `npm install`
    * You should see packages beginning to install
4. Once this is complete, go here: https://discordapp.com/developers/applications/me
    1. Log in or create an account
    2. Click **New App**
    3. Fill in App Name and anything else you'd like to include
    4. Click **Create App**
        * This will provide you with your Client ID and Client Secret
    5. Click **Create Bot User**
        * This will provide you with your bot Username and Token
5. Take all of the information from the page and enter it into the `config/keys.js` file, replacing the placeholders.
6. Navigate to the `config/plex.js` file and replace the placeholders with your Plex Server information
    1. To get your token, following the instructions here: https://support.plex.tv/hc/en-us/articles/204059436-Finding-an-authentication-token-X-Plex-Token
    2. The identifier, product, version, and deviceName can be anything you want
7. Once you have the configs set up correctly, you'll need to authorize your bot on a server you have administrative access to.  For documentation, you can read: https://discordapp.com/developers/docs/topics/oauth2#bots.  The steps are as follows:
    1. Go to `https://discordapp.com/api/oauth2/authorize?client_id=[CLIENT_ID]&scope=bot&permissions=1` where [CLIENT_ID] is the Discord App Client ID
    2. Select **Add a bot to a server** and select the server to add it to
    3. Click **Authorize**
    4. You should now see your bot in your server listed as *Offline*
8. To bring your bot *Online*, navigate to the root of the app (where `index.js` is located) and in your console, type `node index.js`
    * This will start your server.  The console will need to be running for the bot to run.

If I am missing any steps, feel free to reach out or open an issue/bug in the Issues for this repository.

***

## Usage

1. Join a Discord voice channel.
2. Upon playing a song, the bot will join your channel and play your desired song.

***

## Commands

* `!plexTest` : a test to see make sure your Plex server is connected properly
* `!clearqueue` : clears all songs in queue
* `!nextpage` : get next page of songs if desired song is not listed
* `!pause` : pauses current song if one is playing
* `!play <song title or artist>` : bot will join voice channel and play song if one song available.  if more than one, bot will return a list to choose from
* `!playsong <song number>` : plays a song from the generated song list
* `!removesong <song queue number>` : removes song by index from the song queue
* `!resume` : resumes song if previously paused
* `!skip` : skips the current song if one is playing and plays the next song in queue if it exists
* `!stop` : stops song if one is playing
* `!viewqueue` : displays current song queue
* `!bot prefix <prefix>` : changes the bot prefix for the guild

***
## Customization

Update the `config\keys.js` file with your information:

```javascript
module.exports = {
  'botToken'      : 'DISCORD_BOT_TOKEN',
  'defaultPrefix' : '!'
};
```

And update the `config\plex.js` file with your Plex information:

```javascript
module.exports= {
  'hostname'    : 'PLEX_LOCAL_IP',
  'port'        : 'PLEX_LOCAL_PORT',
  'username'    : 'PLEX_USERNAME',
  'password'    : 'PLEX_PASSWORD',
  'token'       : 'PLEX_TOKEN',
  'options'     : {
    'identifier': 'Plex-Discord-Bot',
    'product'   : 'Node.js App',
    'version'   : '1.0.0',
    'deviceName': 'Node.js App',
    'platform'  : 'Discord',
    'device'    : 'Discord'
  }
};
```

If you see any bugs or have any suggestions, use the issue tracker.  Thanks!

***

# Changes
- Fixed bug with `removesong` where removing the currently playing song can break the queue.
    - Solution was to hook up the `skip` command when the removed song index is 0.
- Added Album name and Year to song metadata.
- Added Album Art to embed attachment.
- Refactored code to encapsulate bot and plex commands separately.
- Fixed 

# Future intended changes:
- Add playlists (up to Plex API).
- Change queue end behavior to reduce number of times bot needs to enter and leave music channel.
- Adjust search behavior to be friendlier to user queries (up to Plex API).
- Server admin runtime customization (beyond changing prefix).